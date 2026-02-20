from django.db import models
from django.contrib.auth.models import User 
import uuid

# Create your models here.

class ProductDetails(models.Model):
    name = models.CharField()

    price = models.CharField()

    old_price = models.CharField()

    description = models.TextField()

    game_id = models.CharField()

    genre = models.CharField()

    multi_tag = models.CharField()

    category_name = models.CharField()

    image = models.ImageField(upload_to="product_img/")

    def __str__(self):
        return f"{self.name}, {self.category_name}, Id:{self.game_id}"

class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reset_id = models.UUIDField(
        default=uuid.uuid4, unique=True, editable=False)
    created_when = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Password reset for {self.user.username} at {self.created_when}"
