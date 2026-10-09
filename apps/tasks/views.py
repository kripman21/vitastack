from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q
import uuid
from .models import Task, SubTask
from .serializers import TaskSerializer, SubTaskSerializer
from apps.accounts.permissions import IsManager, IsMemberOrManager

User = get_user_model()

class TaskViewSet(viewsets.ModelViewSet):
    """
    Controlador principal de Tareas en Django REST Framework.
    
    Gestiona el ciclo de vida de las tareas y control de acceso basado en roles (RBAC):
    - MANAGER: Acceso de lectura y escritura global (crear, editar, reasignar, borrar tareas).
    - MEMBER: Acceso de lectura restringido a sus tareas y tareas de su departamento;
      puede mover el estado de tareas que le han sido asignadas, pero no reasignar ni eliminar.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsMemberOrManager]
    lookup_field = 'task_code'

    def get_queryset(self):
        """
        Retorna el conjunto de tareas permitido según el rol del usuario autenticado
        y los parámetros de filtrado (status, priority, assignee, tag).
        """
        user = self.request.user
        queryset = Task.objects.all()

        # Si no es Manager ni staff, filtra por tareas asignadas al usuario o su departamento
        if user.role != 'MANAGER' and not user.is_staff and not user.is_superuser:
            queryset = queryset.filter(
                Q(assignee=user) | Q(assignee__department=user.department)
            )

        # Filtros por Query Parameters
        status_param = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        assignee_param = self.request.query_params.get('assignee')
        tag_param = self.request.query_params.get('tag')

        if status_param:
            queryset = queryset.filter(status=status_param)
        if priority_param:
            queryset = queryset.filter(priority=priority_param)
        if assignee_param:
            queryset = queryset.filter(assignee__id=assignee_param)
        if tag_param:
            queryset = queryset.filter(tags__contains=[tag_param])

        return queryset

    def perform_create(self, serializer):
        """Asigna automáticamente al usuario autenticado como creador de la tarea."""
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Elimina una tarea asegurando que únicamente usuarios MANAGER puedan realizarlo."""
        if request.user.role != 'MANAGER' and not request.user.is_staff and not request.user.is_superuser:
            return Response(
                {"detail": "No tienes permisos de Gerente para eliminar tareas."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='move-status')
    def move_status(self, request, task_code=None):
        """Permite transicionar el estado operativo de una tarea (Drag & Drop en Kanban)."""
        task = self.get_object()
        user = request.user

        # Un Miembro solo puede mover tareas asignadas a él
        if user.role != 'MANAGER' and not user.is_staff and not user.is_superuser:
            if task.assignee != user:
                return Response(
                    {"detail": "No puedes mover el estado de una tarea no asignada a ti."},
                    status=status.HTTP_403_FORBIDDEN
                )

        new_status = request.data.get('status')
        if not new_status or new_status not in dict(Task.Status.choices):
            return Response(
                {"detail": "Estado no válido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.status = new_status
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'], url_path='reassign')
    def reassign(self, request, task_code=None):
        # Exclusivo para Gerentes
        if request.user.role != 'MANAGER' and not request.user.is_staff and not request.user.is_superuser:
            return Response(
                {"detail": "Solo un Gerente puede reasignar tareas."},
                status=status.HTTP_403_FORBIDDEN
            )

        task = self.get_object()
        new_assignee_id = request.data.get('assigneeId') or request.data.get('assignee_id')
        
        if not new_assignee_id:
            return Response(
                {"detail": "Debe especificar assigneeId."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_user = None
        try:
            val_uuid = uuid.UUID(str(new_assignee_id))
            new_user = User.objects.get(id=val_uuid)
        except (ValueError, AttributeError):
            new_user = User.objects.filter(username=new_assignee_id).first()

        if not new_user:
            return Response(
                {"detail": "El usuario especificado no existe."},
                status=status.HTTP_404_NOT_FOUND
            )

        task.assignee = new_user
        task.save()

        return Response({
            "message": f"Tarea {task.task_code} reasignada exitosamente a {new_user.first_name or new_user.username}.",
            "task": TaskSerializer(task).data
        })

class SubTaskViewSet(viewsets.ModelViewSet):
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer
    permission_classes = [IsMemberOrManager]

    @action(detail=True, methods=['patch'], url_path='toggle')
    def toggle(self, request, pk=None):
        subtask = self.get_object()
        subtask.completed = not subtask.completed
        subtask.save()
        return Response(SubTaskSerializer(subtask).data)
