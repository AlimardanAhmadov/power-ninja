import json, re
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.decorators import method_decorator
from django.db import transaction
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model

from rest_framework.generics import (ListCreateAPIView,)
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


from rest_auth.app_settings import JWTSerializer
from rest_auth.utils import jwt_encode 
from rest_auth.views import LoginView

from .renderer_class import MyHTMLRenderer
from .serializers import CustomRegisterSerializer, LoginSerializer

sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters("password1", "password2")
)

User = get_user_model()

class RegisterAPIView(ListCreateAPIView):
    renderer_classes = [MyHTMLRenderer,]
    template_name = 'user/signup.html'
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = CustomRegisterSerializer
    
    
    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(RegisterAPIView, self).dispatch(*args, **kwargs)

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = CustomRegisterSerializer(users, many=True)
        return Response(serializer.data)

    def get_serializer(self, *args, **kwargs):
        return CustomRegisterSerializer(*args, **kwargs)

    def get_response_data(self, user):
        data = {"user": user, "token": self.token}
        return JWTSerializer(data).data

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context = {'request': request})
        if serializer.is_valid():
            user = self.perform_create(serializer)
            if getattr(settings, "REST_USE_JWT", False):
                self.token = jwt_encode(user)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            data = []
            data_keys = []
            emessage=serializer.errors
            for key in emessage:
                err_message = str(emessage[key])
                err_string = re.search("string=(.*), code", err_message)
                message_value = err_string.group(1)
                final_message = f"{key} - {message_value}"
                data.append(final_message)
                data_keys.append(key)

            response = HttpResponse(json.dumps({'error': data, 'error_keys': data_keys}), 
                content_type='application/json')
            response.status_code = 400
            return response

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        return user


class LoginAPIView(LoginView):
    queryset = ""
    renderer_classes = [MyHTMLRenderer,]
    template_name = "user/login.html"
    allowed_methods = ("POST", "OPTIONS", "HEAD", "GET")

    # @method_decorator(cache_page(60 * 15))
    def dispatch(self, *args, **kwargs):
        return super(LoginAPIView, self).dispatch(*args, **kwargs)

    def get(self, request):
        users = User.objects.all()
        serializer = LoginSerializer(users, many=True)
        return Response(serializer.data)

    def get_response(self, request):
        serializer_class = self.get_response_serializer()
        if getattr(settings, "REST_USE_JWT", False):
            data = {"user": self.user, "token": self.token}
            serializer = serializer_class(
                instance=data, context={"request": self.request}
            )
        else:
            serializer = serializer_class(
                instance=self.token, context={"request": self.request}
            )

        token = RefreshToken.for_user(self.user)
        context = {
            'data': serializer.data,
            'status': status.HTTP_200_OK,
            "refresh_token": str(token),
            "access_token": str(token.access_token)
        }
        response = JsonResponse(context)

        return response

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(
            data=self.request.data, context={"request": request}
        )
        if self.serializer.is_valid():
            self.login()
        else:
            data = []
            emessage=self.serializer.errors
            for key in emessage:
                err_message = str(emessage[key])
                err_string = re.search("string=(.*), ", err_message) 
                message_value = err_string.group(1)
                final_message = f"{key} - {message_value}"
                data.append(final_message)

            response = HttpResponse(json.dumps({'error': data}), 
                content_type='application/json')
            response.status_code = 400
            return response
        return self.get_response(request)

