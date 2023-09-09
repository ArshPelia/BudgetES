import json
import requests
import sys

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Debt
from .serializers import DebtSerializer


from rest_framework.response import Response
from rest_framework.decorators import api_view

from requests.exceptions import HTTPError, ConnectionError, Timeout, RequestException
# Load environment variables from file
from dotenv import load_dotenv

import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

""" 
as long as the user is signed in, this function renders the ESapp/inbox.html template

"""


def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "ESapp/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "ESapp/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "ESapp/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]
        age = request.POST["age"]
        ret_fund = request.POST["ret_fund"]
        emg_fund = request.POST["emg_fund"]
        print(str(age))
        print(str(ret_fund))
        print(str(emg_fund))

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "ESapp/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username=email, email=email, password=password)
            user.age = age  # Set age field
            user.ret_fund = ret_fund  # Set ret_fund field
            user.emg_fund = emg_fund  # Set emg_fund field
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "ESapp/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "ESapp/register.html")


@login_required
@api_view(['GET'])
def getAllDebt(request):
    debts = Debt.objects.all()
    serializer = DebtSerializer(debts, many=True)
    return Response(serializer.data)


@csrf_exempt
@login_required
def addDebt(request):

    # Creating a new Debt must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    try:
        data = json.loads(request.body)
        user = request.user
        name = data.get("name", "")
        amount = data.get("amount", "")
        interest_rate = data.get("interest_rate", "")
        min_payment = data.get("min_payment", "")

        # Create the Debt object
        debt = Debt.objects.create(
            account=name,
            user=user,
            amount=amount,
            interest=interest_rate,
            min_pay=min_payment,
        )

        # You can perform additional actions if needed
        # For example, you might want to add tags to the Debt or associate it with the current user

        # Redirect the user to the index page with a success message
        return JsonResponse({'message': 'Debt created successfully.'}, status=201)
    except Exception as e:
        # Handle any errors that occur during Debt creation
        error_message = str(e)
        return JsonResponse({'error': error_message}, status=400)


# Use this decorator to disable CSRF protection for this view, adjust as needed for your application's security requirements.
@csrf_exempt
def processStatement(request):
    if request.method == 'POST':
        try:
            # Assuming the data is sent as JSON
            data = json.loads(request.body.decode('utf-8'))
            # Convert the JSON data to a pandas DataFrame
            df = pd.DataFrame(data)
            print(df)
            # Process the DataFrame as needed
            # ...
            preprocess(df)
            # Return a response, for example:
            response_data = {'message': 'Statement processed successfully'}
            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def preprocess(df):
    current_savings = df[df['Withdrawal'] != 0]['Withdrawal'].sum(
    ) - df[df['Deposit'] != 0]['Deposit'].sum()
    total_spent = df[df['Withdrawal'] != 0]['Withdrawal'].sum()
    total_deposited = df[df['Deposit'] != 0]['Deposit'].sum()

    avg_weekly_deposits = df['Deposit'].sum() / df['Week'].nunique()
    avg_weekly_withdrawals = df['Withdrawal'].sum() / df['Week'].nunique()
    savings_per_week = avg_weekly_deposits - avg_weekly_withdrawals

    avg_monthly_deposits = df['Deposit'].sum() / df['Month'].nunique()
    avg_monthly_withdrawals = df['Withdrawal'].sum() / df['Month'].nunique()
    savings_per_month = avg_monthly_deposits - avg_monthly_withdrawals

    monthly_income = avg_monthly_deposits

    total_invested = df[df['Category'] == 'Investment']['Deposit'].sum()

    print(current_savings)
    print(total_spent)
    print(total_deposited)
    print(savings_per_week)
    print(savings_per_month)
    print(monthly_income)
    print(total_invested)
