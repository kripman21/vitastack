from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

class Task(models.Model):
    class Status(models.TextChoices):
        POR_HACER = 'POR_HACER', 'Por Hacer'
        BACKLOG = 'BACKLOG', 'Backlog'
        EN_PROGRESO = 'EN_PROGRESO', 'En Progreso'
        EN_REVISION = 'EN_REVISION', 'En Revisión'
        COMPLETADA = 'COMPLETADA', 'Completada'

    class Priority(models.TextChoices):
        CRITICA = 'CRITICA', 'Crítica'
        URGENTE = 'URGENTE', 'Urgente'
        ALTA = 'ALTA', 'Alta'
        MEDIA = 'MEDIA', 'Media'
        BAJA = 'BAJA', 'Baja'

    task_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.POR_HACER
    )
    priority = models.CharField(
        max_length=20, 
        choices=Priority.choices, 
        default=Priority.MEDIA
    )
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tasks'
    )
    energy_cost = models.IntegerField(default=15)  # 5 to 35
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=1, default=4.0)
    tags = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True
    )
    due_date = models.DateField()
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.status == self.Status.COMPLETADA and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != self.Status.COMPLETADA and self.completed_at:
            self.completed_at = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.task_code}] {self.title} ({self.get_status_display()})"

class SubTask(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='subtasks'
    )
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.title} - {'[X]' if self.completed else '[ ]'}"
