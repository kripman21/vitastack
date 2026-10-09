from django.db import models
from django.conf import settings
from django.utils import timezone
import datetime

class EnergyHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='energy_history'
    )
    date = models.DateField()
    value = models.IntegerField()
    label = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        ordering = ['date']
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}: {self.value}%"

class DailyCheckIn(models.Model):
    class MoodChoice(models.TextChoices):
        RADIANTE = 'radiante', 'Radiante'
        ESTABLE = 'estable', 'Estable'
        FATIGADO = 'fatigado', 'Fatigado'
        AGOTADO = 'agotado', 'Agotado'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='checkins'
    )
    date = models.DateField(auto_now_add=True)
    sleep_hours = models.DecimalField(max_digits=4, decimal_places=1)
    stress_rating = models.IntegerField()  # 1 to 5
    hydration_liters = models.DecimalField(max_digits=4, decimal_places=1)
    mood = models.CharField(max_length=20, choices=MoodChoice.choices)
    notes = models.TextField(blank=True, default='')
    energy_calculated = models.IntegerField(default=100)

    class Meta:
        ordering = ['-date']

    def calculate_energy(self):
        sleep = float(self.sleep_hours)
        stress = int(self.stress_rating)
        hydration = float(self.hydration_liters)
        
        base_energy = 50.0
        sleep_impact = (sleep - 7.5) * 8.0
        stress_impact = (3 - stress) * 10.0
        hydration_impact = (hydration - 2.0) * 5.0
        
        mood_impacts = {
            'radiante': 15.0,
            'estable': 5.0,
            'fatigado': -15.0,
            'agotado': -30.0,
        }
        mood_impact = mood_impacts.get(self.mood, 0.0)
        
        total = base_energy + sleep_impact + stress_impact + hydration_impact + mood_impact
        return max(5, min(100, int(round(total))))

    def save(self, *args, **kwargs):
        # Auto-calcular energía
        self.energy_calculated = self.calculate_energy()
        super().save(*args, **kwargs)

        # Actualizar estado de salud del usuario
        user = self.user
        user.current_energy = self.energy_calculated
        user.sleep_hours = self.sleep_hours
        user.stress_level = self.stress_rating
        user.last_check_in = timezone.now()

        # Recalcular score de burnout
        raw_burnout = ((100 - self.energy_calculated) * 0.6) + (self.stress_rating * 8)
        user.burnout_score = max(0, min(100, int(round(raw_burnout))))

        if user.burnout_score < 25:
            user.burnout_category = 'Bajo'
        elif user.burnout_score < 50:
            user.burnout_category = 'Saludable'
        elif user.burnout_score < 75:
            user.burnout_category = 'Precaución'
        else:
            user.burnout_category = 'Sobrecarga'

        # Asignar tipo y etiqueta de ánimo
        if self.energy_calculated >= 80:
            user.mood_type = 'optimo'
            user.mood_label = 'Rendimiento Óptimo'
        elif self.energy_calculated >= 50:
            user.mood_type = 'enfocado'
            user.mood_label = 'Enfocado & Estable'
        elif self.energy_calculated >= 25:
            user.mood_type = 'fatiga'
            user.mood_label = 'Fatiga Operativa'
        else:
            user.mood_type = 'burnout'
            user.mood_label = 'Riesgo de Burnout'

        user.save()

        # Registrar / Actualizar historial de energía para el día de hoy
        today = self.date or datetime.date.today()
        EnergyHistory.objects.update_or_create(
            user=user,
            date=today,
            defaults={
                'value': self.energy_calculated,
                'label': user.mood_label
            }
        )

    def __str__(self):
        return f"CheckIn {self.user.username} ({self.date}): {self.energy_calculated}%"
