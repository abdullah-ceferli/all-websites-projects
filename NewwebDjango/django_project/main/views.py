from django.shortcuts import render, redirect
from main.models import *
from main.utils import is_message_appropriate
from django.contrib import messages
import random
from django.core.mail import send_mail
from email_validator import validate_email, EmailNotValidError
from .utils import encrypt_password, decrypt_password
# Create your views here.


def shop(request):
    product_cards_details = ProductDetails.objects.all()

    data = {
        "product_details": product_cards_details,
    }

    return render(request, 'pages/shop.html', data)


def product_details(request):
    return render(request, 'pages/product-details.html')


def contact_us(request):
    if request.method == "POST":
        name = request.POST.get("name")
        surname = request.POST.get("surname")
        email = request.POST.get("email")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        if not SignUp.objects.filter(email=email).exists():
            return render(request, "pages/login.html", {"error": "Email not registered!"})

        full_content = f"{subject} {message}"
        if not is_message_appropriate(full_content):
            return render(request, 'pages/contact-us.html', {
                "error": "Message blocked! Please do not use inappropriate language.",
                "name": name,
                "surname": surname,
                "email": email,
                "subject": subject,
                "message": message
            })

        UserMessage.objects.create(
            name=name,
            surname=surname,
            email=email,
            subject=subject,
            message=message
        )

        messages.success(request, "Thank you! Your message has been sent.")

        return redirect('home')

    return render(request, 'pages/contact-us.html')


def Home(request):
    trending_games = ProductDetails.objects.filter(
        game_id__range=(1, 4), game_id_txt="trending_games")
    most_played = ProductDetails.objects.filter(
        game_id__range=(5, 10), game_id_txt="most_played")
    top_categories = ProductDetails.objects.filter(
        game_id__range=(11, 15), game_id_txt="top_categories")

    data = {
        "trending_games": trending_games,
        "most_played": most_played,
        "top_categories": top_categories,
    }

    return render(request, 'pages/index.html', data)


def auth_page(request):
    if request.method == "POST":
        form_type = request.POST.get("form_type")

        if form_type == "signup":
            username = request.POST.get("username")
            email = request.POST.get("email")
            password = request.POST.get("password")
            phone = request.POST.get("phone")

            if SignUp.objects.filter(username=username).exists():
                return render(request, "pages/login.html", {"error": "Username already taken."})

            if SignUp.objects.filter(email=email).exists():
                return render(request, "pages/login.html", {"error": "Email already registered."})

            try:
                email_info = validate_email(email, check_deliverability=True)
                email = email_info.normalized
            except EmailNotValidError as e:
                return render(request, "pages/login.html", {"error": str(e)})

            code = str(random.randint(100000, 999999))
            try:
                send_mail(
                    'Your Verification Code',
                    f'Your code is: {code}',
                    'speedwagerreal2@gmail.com',
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"SMTP Error: {e}")
                return render(request, "pages/login.html", {"error": "We couldn't send the code. Please check your email address."})

            secure_password = encrypt_password(password)
            request.session['temp_user'] = {
                'username': username,
                'email': email,
                'phone': phone,
                'password': secure_password,
                'code': code
            }
            return redirect('verify_page')

    return render(request, "pages/login.html")


def verify_page(request):
    temp_data = request.session.get('temp_user')

    if not temp_data:
        return redirect('auth_page')

    if request.method == "POST":
        user_code = request.POST.get("code")

        if temp_data['code'] == user_code:
            SignUp.objects.create(
                username=temp_data['username'],
                email=temp_data['email'],
                phone=temp_data['phone'],
                password=temp_data['password']
            )
            del request.session['temp_user']
            return render(request, "pages/login.html", {"success": "Account Verified and Created!"})
        else:
            return render(request, "pages/verify.html", {"error": "Wrong code!"})

    return render(request, "pages/verify.html")
