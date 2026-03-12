from django.urls import path
from main.views import *

urlpatterns = [
    path('home/', Home, name='home'),
    path('shop/', shop, name='shop'),
    path('product_details/', product_details, name='product_details'),
    path('contact_us/', contact_us, name='contact_us'),
    path('sign_up/', auth_page, name='sign_up'),
]
