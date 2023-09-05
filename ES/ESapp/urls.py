from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("debt/all", views.alldebt, name="alldebt"),
    path("debt/create", views.create_debt, name="create_debt"),

]
