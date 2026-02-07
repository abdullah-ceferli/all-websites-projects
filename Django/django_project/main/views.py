from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def home(request):
    return render(request, 'index.html')

def find404(request):
    return HttpResponse('<h1>404<h1>')