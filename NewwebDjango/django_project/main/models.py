from django.db import models

# Create your models here.

class ProductDetails(models.Model):
    name = models.CharField(max_length=25)

    price = models.CharField(help_text="If you want make this free write: free <br> also write into old_price: free", max_length=5)

    old_price = models.CharField(help_text="If not have old price write: not_have", max_length=8)

    description = models.TextField()

    game_id = models.IntegerField()

    game_id_txt = models.CharField(max_length=20)

    genre = models.CharField()

    multi_tag = models.CharField()

    category_name = models.CharField(max_length=10)

    image = models.ImageField(upload_to="product_img/")

    image_formated = models.ImageField(verbose_name="Image 300x220", upload_to="product_img/")

    def __str__(self):
        return f"Game name: {self.name}/ Game id: {self.game_id}"


class SignUp(models.Model):
    username = models.CharField()

    email = models.EmailField()

    phone = models.IntegerField()

    password = models.CharField()

    def __str__(self):
        return f"UserName: {self.username}, Email: {self.email}"
    
class UserMessage(models.Model):
    name = models.CharField()

    surname = models.CharField()

    email = models.CharField()

    subject = models.CharField()

    message = models.TextField()

    def __str__(self):
        return f"Name: {self.name}, Email: {self.email}"