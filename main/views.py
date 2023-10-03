import logging
from django.shortcuts import render
import re
import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from django.shortcuts import render
from django.views import View
from django.http import HttpResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.generic import ListView


def home(request):
    return render(request, 'main/base.html')


def choose_service(request):
    return render(request, 'main/choose_service.html')


def best_rates_pages(request):
    return render(request, 'main/best_rates.html')


def auto_switch(request):
    return render(request, 'main/auto_switch.html')


class BestRatesView(ListView):
    template_name = 'main/best_rates.html'
    context_object_name = 'page_data'

    def extract_company_data(self, row, titles):
        name = ''
        address = ''
        phone = ''
        company_url = ''
        phone_number = ''

        if titles:
            title_text = titles[0].text.strip()
            name_match = re.match(r'(.+?)<p>(\d{1,4} .+?\d{5}.*?)</p><p>(\(\d{3}\) \d{3}-\d{4})</p>', title_text)
            if name_match:
                name = name_match.group(1).strip()
                address = name_match.group(2).strip()
                phone = name_match.group(3)

                # Remove variations of "PO Box" from the company name
                name = re.sub(r'P\.?O\.?\s?Box', '', name, flags=re.IGNORECASE).strip()


        if row:
            # Check if the row has at least one element
            # if row[0]:
            #     # Try to detect name, address, and phone based on the provided format
            #     name_address_match = re.match(r'(.+?)(\d{1,4} .+?\d{5})(.*)', row[0])
            #     if name_address_match:
            #         name = name_address_match.group(1).strip()
            #         address = name_address_match.group(2).strip()
            #         phone = name_address_match.group(3)

            #         # Remove variations of "PO Box" from the company name
            #         name = re.sub(r'P\.?O\.?\s?Box', '', name, flags=re.IGNORECASE).strip()

            #     # If the name and address are still empty, try another format
            #     if not name or not address:
            #         name_address_match = re.match(r'(.+?)(\d{5})(.*)', row[0])
            #         if name_address_match:
            #             name = name_address_match.group(1).strip()
            #             address = name_address_match.group(2).strip()
            #             phone = name_address_match.group(3)

            #             # Remove variations of "PO Box" from the company name
            #             name = re.sub(r'P\.?O\.?\s?Box', '', name, flags=re.IGNORECASE).strip()

            # Handle the rest of the data as before
            company_url_match = re.search(r'(https?://[^\s]+)', row[0])
            if company_url_match:
                company_url = company_url_match.group(1)

        phone_number_match = re.search(r'\(\d{3}\) \d{3}-\d{4}', phone)
        if phone_number_match:
            phone_number = phone_number_match.group()

        return {
            "name": name,
            "address": address,
            "phone_number": phone_number,
            "company_url": company_url,
            # "kwh": float(row[1]) if len(row) > 1 else 0,
            # "variable": row[2] if len(row) > 2 else '',
            # "renewable": float(row[3].strip('%')) if len(row) > 3 else 0,
            # "term_length": row[5] if len(row) > 5 else '',
            # "monthly_fee": float(re.sub(r'[^\d.]', '', row[6])) if len(row) > 6 and row[6] else 0,
            # "promo_offers": row[7] if len(row) > 7 else ''
        }


    def get_queryset(self):
        territory_id = self.request.GET.get('TerritoryId', '4')
        url = f"https://energychoice.ohio.gov/ApplesToApplesComparision.aspx?Category=Electric&TerritoryId={territory_id}&RateCode=1"

        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            table = soup.find('table')

            data = []
            for row in table.find_all('tr'):
                cols = row.find_all('td')
                titles = row.find_all(class_='retail-title')
                cols = [ele.text.strip() for ele in cols]
                titles = [title for title in titles]
                if cols and titles:
                    data.append({'row': cols, 'titles': titles})

            parsed_data = [self.extract_company_data(item['row'], item['titles']) for item in data if len(item['row']) >= 8]

            df = pd.DataFrame(parsed_data)
            df.sort_values(by='kwh', inplace=True)
            df['total_cost'] = df['kwh'] * 1000 + df['monthly_fee']

            queryset = df.to_dict('records')

            return queryset
        else:
            return []

    def get_context_data(self, **kwargs):
        territory_id = self.request.GET.get('TerritoryId', '4')
        url = f"https://energychoice.ohio.gov/ApplesToApplesComparision.aspx?Category=Electric&TerritoryId={territory_id}&RateCode=1"

        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            table = soup.find('table')
            
            span_elements = soup.find_all('span', style="margin: 0px; padding: 0px; font-size: 11.5pt; color: red; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;")
            if len(span_elements) >= 2:
                second_span_element = span_elements[1]
                text_data = second_span_element.text if second_span_element else ""
            else:
                text_data = ""

            context = super().get_context_data(**kwargs)
            context['results'] = "No optimal business found." if not context['page_data'] else ""
            context['text_data'] = text_data
            print(context['text_data'])

            return context
        else:
            return super().get_context_data(**kwargs)(**kwargs)

