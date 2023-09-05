from rest_framework import serializers
from .models import Debt


class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = '__all__'  # Include all fields from the Debt model
