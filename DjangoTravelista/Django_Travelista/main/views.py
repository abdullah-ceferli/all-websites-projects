from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'pages/index.html')

def about(request):
    return render(request, 'pages/about.html')

def blogHome(request):
    return render(request, 'pages/blog-home.html')

def blogSingle(request):
    return render(request, 'pages/blog-single.html')

def hotels(request):
    return render(request, 'pages/hotels.html')

def packages(request):
    return render(request, 'pages/packages.html')

def insurance(request):
    return render(request, "pages/insurance.html")