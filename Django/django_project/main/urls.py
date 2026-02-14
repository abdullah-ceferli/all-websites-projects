from django.urls import path
from main.views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('home/', home, name='home'),
    path('shop/', shop, name='shop'),
    path('product_details/', product_details, name='product_details'),
    path('contact_us/', contact_us, name='contact_us'),
    path('login/', login, name='login'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
