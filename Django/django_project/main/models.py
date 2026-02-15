from django.db import models

# Create your models here.

class Products(models.Model):
    name = models.CharField()
    
    price = models.CharField()
    
    old_price = models.CharField()
    
    description = models.TextField()
    
    game_id = models.CharField()
    
    genre = models.CharField()
    
    multi_tag = models.CharField()
    
    category_name = models.CharField()
    
    image = models.ImageField(upload_to="media/product_img/")

    def __str__(self):
        return f"{self.name}, {self.price}, {self.game_id}"