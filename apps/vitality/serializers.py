from rest_framework import serializers
from .models import DailyCheckIn, EnergyHistory
from apps.accounts.serializers import UserSerializer

class EnergyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EnergyHistory
        fields = ['id', 'date', 'value', 'label']

class DailyCheckInSerializer(serializers.ModelSerializer):
    userId = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    sleepHours = serializers.DecimalField(source='sleep_hours', max_digits=4, decimal_places=1)
    stressRating = serializers.IntegerField(source='stress_rating')
    hydrationLiters = serializers.DecimalField(source='hydration_liters', max_digits=4, decimal_places=1)
    energyCalculated = serializers.IntegerField(source='energy_calculated', read_only=True)

    class Meta:
        model = DailyCheckIn
        fields = [
            'id', 'userId', 'date', 'sleepHours', 'stressRating',
            'hydrationLiters', 'mood', 'notes', 'energyCalculated'
        ]
        read_only_fields = ['id', 'date', 'energyCalculated']
