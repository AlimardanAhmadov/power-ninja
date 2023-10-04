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

    def extract_company_data(self, row, extracted_titles):
        company_url = ''
        phone_number = ''

        if row:
            company_url_match = re.search(r'(https?://[^\s]+)', row[0])
            if company_url_match:
                company_url = company_url_match.group(1)

        return {
            "name": extracted_titles[0],
            "address": extracted_titles[1],
            "phone_number": extracted_titles[2],
            "company_url": company_url,
            "kwh": float(row[1]) if len(row) > 1 else 0,
            "variable": row[2] if len(row) > 2 else '',
            "renewable": float(row[3].strip('%')) if len(row) > 3 else 0,
            "term_length": row[5] if len(row) > 5 else '',
            "monthly_fee": float(re.sub(r'[^\d.]', '', row[6])) if len(row) > 6 and row[6] else 0,
            "promo_offers": row[7] if len(row) > 7 else ''
        }

    def extract_titles(self, titles):
        results = []
        for title in titles:
            title_text = str(title)
            # Replace <br/> with space
            title_text = title_text.replace('<br/>', ' ')
            name_match = re.match(r'(.+?)<p>(.*?)</p><p>(.*?)</p>', title_text)
            if name_match:
                name = name_match.group(1).strip().replace('<span class="retail-title">', '')
                address = name_match.group(2).strip()
                phone = name_match.group(3).strip()

                # Remove variations of "PO Box" from the company name
                name = re.sub(r'P\.?O\.?\s?Box', '', name, flags=re.IGNORECASE).strip()

                results.append((name, address, phone))
        return results

    def extract_text_data(self, span_elements):
        if len(span_elements) >= 2:
            second_span_element = span_elements[1]
            text_data = second_span_element.text if second_span_element else ""
        else:
            text_data = ""

        return {
            'text_data': text_data
        }
            
    def get_queryset(self):
        territory_id = self.request.GET.get('TerritoryId', '4')
        url = f"https://energychoice.ohio.gov/ApplesToApplesComparision.aspx?Category=Electric&TerritoryId={territory_id}&RateCode=1"

        response = requests.get(url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            table = soup.find('table')

            data = []
            extracted_titles = []
            for row in table.find_all('tr'):
                cols = row.find_all('td')
                titles = row.find_all(class_='retail-title')
                title = self.extract_titles(titles)
                if title and len(title) > 0:  # Ensure there is a valid title extracted for the current row
                    extracted_titles.append(title[0])  # Only take the first title for the current row
                    cols = [ele.text.strip() for ele in cols]
                    data.append([ele for ele in cols if ele])

            # print("Extracted Titles:", extracted_titles)  # Debug statement
            parsed_data = []
            for idx, row in enumerate(data):
                if len(row) >= 8:
                    try:
                        company_data = self.extract_company_data(row, extracted_titles[idx])
                        parsed_data.append(company_data)
                    except Exception as e:
                        print(f"Error processing row {idx + 1}: {e}")  # Print any exceptions for debugging

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

            element_with_kwh = soup.find(lambda tag: tag.name == 'span' and '/kWh' in tag.text)
            if element_with_kwh:
                text_data = element_with_kwh.text if element_with_kwh else ""
                match = re.search(r'(\d+\.\d+|\d+)', text_data)

                text_data = float(match.group()) if match else None
            else:
                text_data = ""

            context = super().get_context_data(**kwargs)
            context['results'] = "No optimal business found." if not context['page_data'] else ""
            context['text_data'] = text_data


            print(context['text_data'])

            return context
        else:
            return super().get_context_data(**kwargs)