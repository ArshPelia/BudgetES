from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Any custom fields you might want to add to the user model
    age = models.IntegerField(default=None, null=True)
    ret_fund = models.DecimalField(
        default=None, max_digits=10, decimal_places=2, null=True)
    emg_fund = models.DecimalField(
        default=None, max_digits=10, decimal_places=2, null=True)
    newuser = models.BooleanField(default=True)


class Debt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.CharField(max_length=200)
    amount = models.DecimalField(
        default=None, max_digits=10, decimal_places=2, null=True)
    interest = models.DecimalField(
        default=None, max_digits=10, decimal_places=2, null=True)
    min_pay = models.DecimalField(
        default=None, max_digits=10, decimal_places=2, null=True)
