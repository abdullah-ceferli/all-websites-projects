from django.shortcuts import render
from main.models import *
from django.shortcuts import render
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
            return render(request, "pages/login.html", {"error": "That Email is not registered! Please sign up first."})

        user_msg = UserMessage(
            name=name,
            surname=surname,
            email=email,
            subject=subject,
            message=message,
        )
        user_msg.save()

        return render(request, 'pages/index.html')

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
            phone = request.POST.get("phone")
            password = request.POST.get("password")

            if SignUp.objects.filter(email=email).exists():
                return render(request, "pages/login.html", {"error": "Email having in DataBase"})

            user = SignUp(
                username=username,
                email=email,
                phone=phone,
                password=password,
            )
            user.save()
            return render(request, "pages/login.html", {"success": "success"})

        elif form_type == "login":
            email = request.POST.get("email")
            password = request.POST.get("password")

            try:
                user = SignUp.objects.get(email=email)
                if user.password == password:
                    return render(request, "pages/index.html", {"user": user})
                else:
                    return render(request, "pages/login.html", {"error": "Password Inncorrect"})
            except SignUp.DoesNotExist:
                return render(request, "pages/login.html", {"error": "Account not having"})

    return render(request, "pages/login.html")
