from django.contrib import admin
from django.urls import path, include
from main.views import *

urlpatterns = [
    path('home/', home, name='home'),
    path('about/', about, name='about'),
    path('blog-home/', blogHome, name='blog-home'),
    path('blog-single/', blogSingle, name='blog-single'),
    path('hotels/', hotels, name='hotels'),
    path('packages/', packages, name='packages'),
    path('insurance/', insurance, name='insurance'),
]
