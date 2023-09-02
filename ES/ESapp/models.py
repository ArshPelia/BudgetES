from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Any custom fields you might want to add to the user model
    age = models.IntegerField(default=None,null=True)
    ret_fund = models.DecimalField(default= None, max_digits=10, decimal_places=2, null=True)
    emg_fund = models.DecimalField(default= None, max_digits=10, decimal_places=2, null=True)
    newuser = models.BooleanField(default=True)
    pass
