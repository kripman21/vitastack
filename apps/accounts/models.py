import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        MANAGER = 'MANAGER', 'Gerente / Administrador'
        MEMBER = 'MEMBER', 'Especialista / Miembro del Equipo'

    class BurnoutCategory(models.TextChoices):
        BAJO = 'Bajo', 'Bajo'
        SALUDABLE = 'Saludable', 'Saludable'
        PRECAUCION = 'Precaución', 'Precaución'
        SOBRECARGA = 'Sobrecarga', 'Sobrecarga'

    class MoodType(models.TextChoices):
        OPTIMO = 'optimo', 'Óptimo'
        ENFOCADO = 'enfocado', 'Enfocado'
        FATIGA = 'fatiga', 'Fatiga'
        BURNOUT = 'burnout', 'Burnout'

    class UserStatus(models.TextChoices):
        ACTIVE = 'active', 'Activo'
        IN_BREAK = 'in_break', 'En Pausa'
        DEEP_WORK = 'deep_work', 'Trabajo Profundo'
        OFFLINE = 'offline', 'Desconectado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    specialty = models.CharField(max_length=150, blank=True, default='')
    department = models.CharField(max_length=150, blank=True, default='')
    
    current_energy = models.IntegerField(default=100)  # 0 to 100
    max_energy = models.IntegerField(default=100)
    burnout_score = models.IntegerField(default=0)     # 0 to 100
    burnout_category = models.CharField(
        max_length=20, 
        choices=BurnoutCategory.choices, 
        default=BurnoutCategory.SALUDABLE
    )
    mood_label = models.CharField(max_length=100, default='Enfocado')
    mood_type = models.CharField(
        max_length=20, 
        choices=MoodType.choices, 
        default=MoodType.ENFOCADO
    )
    sleep_hours = models.DecimalField(max_digits=4, decimal_places=1, default=7.5)
    stress_level = models.IntegerField(default=2)  # 1 to 5
    status = models.CharField(
        max_length=20, 
        choices=UserStatus.choices, 
        default=UserStatus.ACTIVE
    )
    last_check_in = models.DateTimeField(null=True, blank=True)
    
    avatar = models.CharField(max_length=500, blank=True, default='')
    initials = models.CharField(max_length=10, blank=True, default='')

    def save(self, *args, **kwargs):
        if not self.initials and (self.first_name or self.last_name or self.username):
            names = (self.first_name + ' ' + self.last_name).strip() or self.username
            parts = names.split()
            if len(parts) >= 2:
                self.initials = (parts[0][0] + parts[1][0]).upper()
            elif len(parts) == 1 and len(parts[0]) > 0:
                self.initials = parts[0][:2].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return f"{full_name or self.username} ({self.get_role_display()})"
