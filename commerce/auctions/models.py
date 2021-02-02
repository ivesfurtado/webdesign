from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listing(models.Model):
    auction_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    auction_title = models.CharField(max_length=64)
    auction_enddate = models.DateField()
    auction_description = models.CharField(max_length=255)
    auction_startingbid = models.FloatField()
    auction_pubdate = models.DateField()
    auction_imageurl = models.CharField(max_length=128, blank=True)
    auction_category = models.CharField(max_length=64)

class Comments(models.Model):
    comments_user = models.ForeignKey(User, on_delete=models.CASCADE)
    comments_auction = models.ForeignKey(Listing, on_delete=models.CASCADE)
    comments_content = models.CharField(max_length=255)
    comments_pubdate = models.DateField()

class Bids(models.Model):
    bids_buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    bids_product = models.CharField(max_length=64)
    bids_offer = models.FloatField()

class Watchlist(models.Model):
    watchlist_user = models.ForeignKey(User, on_delete=models.CASCADE)
    watchlist_product = models.ForeignKey(Listing, on_delete=models.CASCADE)