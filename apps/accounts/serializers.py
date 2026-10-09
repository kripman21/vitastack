from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    currentEnergy = serializers.IntegerField(source='current_energy')
    maxEnergy = serializers.IntegerField(source='max_energy')
    burnoutScore = serializers.IntegerField(source='burnout_score')
    burnoutCategory = serializers.CharField(source='burnout_category')
    moodLabel = serializers.CharField(source='mood_label')
    moodType = serializers.CharField(source='mood_type')
    sleepHours = serializers.FloatField(source='sleep_hours')
    stressLevel = serializers.IntegerField(source='stress_level')
    lastCheckIn = serializers.DateTimeField(source='last_check_in', allow_null=True)
    energyHistory = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'name', 'first_name', 'last_name',
            'role', 'avatar', 'initials', 'specialty', 'department',
            'currentEnergy', 'maxEnergy', 'burnoutScore', 'burnoutCategory',
            'moodLabel', 'moodType', 'sleepHours', 'stressLevel',
            'status', 'lastCheckIn', 'energyHistory'
        ]
        read_only_fields = ['id', 'initials']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def get_energyHistory(self, obj):
        history = obj.energy_history.all().order_by('-date')[:7]
        return [
            {
                "date": item.date.strftime("%a") if hasattr(item.date, "strftime") else str(item.date),
                "value": item.value,
                "label": item.label
            }
            for item in reversed(list(history))
        ]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'role', 'specialty', 'department'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
