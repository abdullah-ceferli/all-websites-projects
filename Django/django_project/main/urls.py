from django.urls import path
from main.views import *
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = [
    path('home/', home, name='home'),
    path('shop/', shop, name='shop'),
    path('product_details/', product_details, name='product_details'),
    path('contact_us/', contact_us, name='contact_us'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
