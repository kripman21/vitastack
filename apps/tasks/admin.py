from django.contrib import admin
from .models import Task, SubTask

class SubTaskInline(admin.TabularInline):
    model = SubTask
    extra = 1

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_code', 'title', 'status', 'priority', 'assignee', 'energy_cost', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'due_date', 'assignee')
    search_fields = ('task_code', 'title', 'description')
    inlines = [SubTaskInline]

@admin.register(SubTask)
class SubTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'task', 'completed')
    list_filter = ('completed',)
    search_fields = ('title', 'task__task_code', 'task__title')
