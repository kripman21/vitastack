from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsManager(BasePermission):
    """
    Permite acceso únicamente a Gerentes / Administradores o Superusuarios.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'MANAGER' or request.user.is_staff or request.user.is_superuser)
        )

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)

class IsMemberOrManager(BasePermission):
    """
    Permite acceso de lectura a usuarios autenticados.
    Permite creación/modificación según la lógica de la vista.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Si es Gerente, tiene permisos totales
        if request.user.role == 'MANAGER' or request.user.is_staff or request.user.is_superuser:
            return True
            
        # Si es lectura (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True
            
        # Para tareas, un miembro solo puede modificar su tarea asignada
        if hasattr(obj, 'assignee'):
            return obj.assignee == request.user
            
        # Para checkins o usuarios, solo puede modificar el suyo propio
        if hasattr(obj, 'user'):
            return obj.user == request.user

        if obj == request.user:
            return True

        return False
