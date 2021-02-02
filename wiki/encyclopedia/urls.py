from django.urls import path

from . import views

app_name = "encyclopedia"
urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.title_index, name="title_index"),
    path("new", views.new, name="new"),
    path("edit/<str:entry>", views.edit, name="edit"),
    path("random", views.randompage, name="randompage"),
    path("search_result", views.search_result, name="search_result")
]
