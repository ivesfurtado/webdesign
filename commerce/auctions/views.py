from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import validators
from .models import User, Listing, Comments, Bids, Watchlist
import datetime

def messageVerifier(reqget):
    message1, message2, message3 = False, False, False
    if "success" in reqget:
        message = True
    elif "fail" in reqget:
        message2 = True
    elif "watchsuccess" in reqget:
        message3 = True
    return message1, message2, message3

def index(request):
    message1, message2, message3 = messageVerifier(request.GET)
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings.order_by('-auction_pubdate'),
        "message1": message1,
        "message2": message2,
        "message3": message3
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


@login_required(login_url='login')
def create_listing(request):
    if request.method == 'POST':
        username = request.user
        title = request.POST["title"]
        enddate = request.POST["enddate"] 
        description = request.POST["description"]
        startingbid = request.POST["startingbid"]
        imageurl = request.POST["imageurl"]
        category = request.POST["category"]
        date = datetime.datetime.now()
        if imageurl == "":
            imageurl = "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
        listing = Listing.objects.create(auction_owner=username, auction_pubdate=date, auction_title=title, auction_enddate=enddate, auction_description=description, auction_startingbid=startingbid, auction_imageurl=imageurl, auction_category=category)
    return render(request, "auctions/list.html", {
        "categories": Listing.objects.values_list('auction_category', flat=True)
    })


@login_required(login_url='login')
def bid(request):
    if request.method == 'POST':
        user = request.user
        bids = request.POST["bids"]
        listing = Listing.objects.get(pk=request.POST["product"])
        if request.POST["watchlist"] == "add":
            watchlist = Watchlist.objects.create(watchlist_user=user, watchlist_product=listing)
            return HttpResponseRedirect(f"{request.META.get('HTTP_REFERER')}?watchsuccess")
        if request.POST["watchlist"] == "remove":
            watchlist = Watchlist.objects.get(watchlist_user=user, watchlist_product=listing)
            watchlist.delete()
            return HttpResponseRedirect(f"{request.META.get('HTTP_REFERER')}?deletesuccess")
        if bids == "":
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        if float(bids) <= listing.auction_startingbid:
            return HttpResponseRedirect(f"{request.META.get('HTTP_REFERER')}?fail")
        listing.auction_startingbid = bids
        listing.save()
        bid = Bids.objects.create(bids_buyer=user, bids_product=listing, bids_offer=bids)
        return HttpResponseRedirect(f"{request.META.get('HTTP_REFERER')}?success")


@login_required(login_url='login')
def watchlist(request):
    user = request.user
    watchlist = Watchlist.objects.get(pk=user.id)
    listings = Listing.objects.filter(pk=watchlist.watchlist_product.id)
    message1, message2, message3 = messageVerifier(request.GET)
    return render(request, "auctions/watchlist.html", {
        "username": user.username,
        "watchlist": listings,
        "message1": message1,
        "message2": message2,
        "message3": message3
    })

def listing(request, product_id):
    if request.user.is_authenticated:
        loggedin = True
    else:
        loggedin = False
    message1, message2, message3 = messageVerifier(request.GET)
    product = Listing.objects.get(pk=product_id)
    comments = Comments.objects.filter(comments_auction=product).order_by('-comments_pubdate')
    return render(request, "auctions/listing.html", {
        "product": product,
        "comments": comments,
        "loggedin": loggedin,
        "message1": message1,
        "message2": message2,
        "message3": message3
    })


def comment(request):
    if request.method == 'POST':
        user = request.user
        comment = request.POST["comment"]
        product = request.POST["product"]
        listing = Listing.objects.get(pk=product)
        date = datetime.datetime.now()
        comment = Comments.objects.create(comments_user=user, comments_auction=listing, comments_content=comment, comments_pubdate=date)
        return HttpResponseRedirect(reverse('listing', kwargs={'product_id': product}))