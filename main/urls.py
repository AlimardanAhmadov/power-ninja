from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('choose-your-service', views.choose_service, name='choose_service'),
    path('best-rates', views.BestRatesView.as_view(), name='best_rates'),
    path('auto-switch', views.auto_switch, name='auto_switch'),
]