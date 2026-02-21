# class PasswordReset(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     reset_id = models.UUIDField(
#         default=uuid.uuid4, unique=True, editable=False)
#     created_when = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Password reset for {self.user.username} at {self.created_when}"


from django.db import models
from django.contrib.auth.models import User 
import uuid

# Create your models here.

class ProductDetails(models.Model):
    name = models.CharField(max_length=13)

    price = models.CharField(max_length=5)

    old_price = models.CharField(max_length=5)

    description = models.TextField()

    game_id = models.IntegerField()

    genre = models.CharField()

    multi_tag = models.CharField()

    category_name = models.CharField(max_length=10)

    image = models.ImageField(upload_to="product_img/")

    def __str__(self):
        return f"Game name: {self.name} / Category: {self.category_name} / Id: {self.game_id}"


class SignUp(models.Model):
    username = models.CharField()
    email = models.EmailField()
    phone = models.IntegerField()
    password = models.CharField()

    def __str__(self):
        return f"UserName: {self.username}, Email: {self.email}"