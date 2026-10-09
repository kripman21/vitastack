from django.contrib import admin
from .models import DailyCheckIn, EnergyHistory

@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'sleep_hours', 'stress_rating', 'hydration_liters', 'mood', 'energy_calculated')
    list_filter = ('mood', 'stress_rating', 'date')
    search_fields = ('user__username', 'user__email', 'notes')

@admin.register(EnergyHistory)
class EnergyHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'value', 'label')
    list_filter = ('date',)
    search_fields = ('user__username', 'label')
