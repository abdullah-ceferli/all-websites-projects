from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .forms import OptionalEmailUserCreationForm 
# Create your views here.

def home(request):
    return render(request, 'pages/index.html')

def shop(request):
    return render(request, 'pages/shop.html')

def product_details(request):
    return render(request, 'pages/product-details.html')

def contact_us(request):
    return render(request, 'pages/contact-us.html')

def register_view(request):
    if request.method == 'POST':
        form = OptionalEmailUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('login')
        else:
            messages.error(request, "Registration failed. Please check the errors below.")
    else:
        form = OptionalEmailUserCreationForm()
    
    return render(request, 'pages/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    return render(request, 'pages/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')