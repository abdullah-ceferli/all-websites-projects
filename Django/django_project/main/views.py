# from django.shortcuts import render, redirect
# from django.contrib.auth import authenticate, login
# from django.contrib.auth.models import User
# from django.contrib import messages

# def login_view(request):
#     if request.method == 'POST':
#         email = request.POST.get('email')
#         password = request.POST.get('password')
#         user = authenticate(request, username=email, password=password) 
#         if user is not None:
#             login(request, user)
#             return redirect('home')
#         else:
#             messages.error(request, 'Invalid credentials')
#     return render(request, 'login.html')

# def register_view(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         email = request.POST.get('email')
#         phone = request.POST.get('phone')
#         password = request.POST.get('password')

#         if User.objects.filter(username=username).exists():
#             messages.error(request, 'Username already taken')
#         elif User.objects.filter(email=email).exists():
#             messages.error(request, 'Email already registered')
#         else:
#             user = User.objects.create_user(
#                 username=username,
#                 email=email,
#                 password=password
#             )
#             user.save()
#             login(request, user)
#             return redirect('home')
#     return render(request, 'login.html')


from django.shortcuts import render
# Create your views here.

def home(request):
    return render(request, 'pages/index.html')

def shop(request):
    return render(request, 'pages/shop.html')

def product_details(request):
    return render(request, 'pages/product-details.html')

def contact_us(request):
    return render(request, 'pages/contact-us.html')

def login(request):
    return render(request, 'pages/login.html')
