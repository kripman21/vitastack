from rest_framework import serializers
from .models import Task, SubTask
from apps.accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
import datetime

User = get_user_model()

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'title', 'completed']

class TaskSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='task_code', required=False)
    assigneeId = serializers.PrimaryKeyRelatedField(
        source='assignee', 
        queryset=User.objects.all(), 
        allow_null=True, 
        required=False
    )
    createdById = serializers.PrimaryKeyRelatedField(
        source='created_by', 
        queryset=User.objects.all(), 
        required=False
    )
    energyCost = serializers.IntegerField(source='energy_cost')
    estimatedHours = serializers.FloatField(source='estimated_hours')
    dueDate = serializers.DateField(source='due_date')
    completedAt = serializers.DateTimeField(source='completed_at', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    subtasks = SubTaskSerializer(many=True, required=False)
    vencimientoLabel = serializers.SerializerMethodField()
    assignee = UserSerializer(read_only=True)
    createdBy = UserSerializer(source='created_by', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'task_code', 'title', 'description', 'status', 'priority',
            'assigneeId', 'createdById', 'assignee', 'createdBy',
            'energyCost', 'estimatedHours', 'tags', 'subtasks',
            'dueDate', 'vencimientoLabel', 'completedAt', 'createdAt'
        ]

    def get_vencimientoLabel(self, obj):
        if not obj.due_date:
            return ""
        today = datetime.date.today()
        diff = (obj.due_date - today).days
        if diff < 0:
            return f"Vencida (hace {abs(diff)} días)"
        elif diff == 0:
            return "Hoy (Urgente)"
        elif diff == 1:
            return "Mañana"
        else:
            return f"En {diff} días"

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        
        # Auto-generar task_code si no viene especificado
        if 'task_code' not in validated_data or not validated_data['task_code']:
            last_task = Task.objects.order_by('-id').first()
            next_num = 101
            if last_task and last_task.task_code.startswith("BIO-"):
                try:
                    next_num = int(last_task.task_code.replace("BIO-", "")) + 1
                except ValueError:
                    pass
            validated_data['task_code'] = f"BIO-{next_num}"
            
        task = Task.objects.create(**validated_data)
        
        for sub_data in subtasks_data:
            SubTask.objects.create(task=task, **sub_data)
            
        return task

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if subtasks_data is not None:
            # Recrear o actualizar subtareas
            instance.subtasks.all().delete()
            for sub_data in subtasks_data:
                SubTask.objects.create(task=instance, **sub_data)

        return instance
