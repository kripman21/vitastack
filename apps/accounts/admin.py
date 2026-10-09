from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Información VitaStack / BioTask', {
            'fields': (
                'role', 'specialty', 'department', 'current_energy', 'max_energy',
                'burnout_score', 'burnout_category', 'mood_label', 'mood_type',
                'sleep_hours', 'stress_level', 'status', 'last_check_in', 'avatar', 'initials'
            )
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'department', 'current_energy', 'burnout_score', 'status')
    list_filter = ('role', 'department', 'status', 'burnout_category')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'specialty')
