from django.urls import path
from main.views import *
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('home/', Home, name='home'),
    path('shop/', shop, name='shop'),
    path('product_details/', product_details, name='product_details'),
    path('contact_us/', contact_us, name='contact_us'),
    
    path('register/', views.RegisterView, name='register'),
    path('login/', views.LoginView, name='login'),
    path('logout/', views.LogoutView, name='logout'),
    path('forgot-password/', views.ForgotPassword, name='forgot-password'),
    path('password-reset-sent/<str:reset_id>/', views.PasswordResetSent, name='password-reset-sent'),
    path('reset-password/<str:reset_id>/', views.ResetPassword, name='reset-password'),
]
