from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, RegisterSerializer
from .permissions import IsManager, IsMemberOrManager

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista de Autenticación JWT Personalizada.
    
    Genera pares de tokens (access y refresh) e incluye la información
    completa del perfil del usuario en la respuesta inicial de login.
    """
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """
    Registro público de nuevos especialistas en el clúster.
    Asigna por defecto el rol MEMBER y los valores de energía iniciales.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CurrentUserView(APIView):
    """
    Gestión del perfil del usuario actualmente autenticado (/api/auth/me/).
    - GET: Obtiene la información del usuario en sesión.
    - PATCH: Permite actualizar estado operativo, mood o especialidad.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        data = request.data.copy()
        
        # Permitir actualización de campos de estado o perfil
        if 'status' in data:
            user.status = data['status']
        if 'moodLabel' in data or 'mood_label' in data:
            user.mood_label = data.get('moodLabel', data.get('mood_label'))
        if 'specialty' in data:
            user.specialty = data['specialty']
        if 'department' in data:
            user.department = data['department']
            
        user.save()
        return Response(UserSerializer(user).data)

class UserListView(generics.ListAPIView):
    """
    Lista de todos los especialistas registrados en la plantilla.
    Disponible para todos los usuarios autenticados para permitir asignación de tareas.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Gestión administrativa de un miembro específico (/api/auth/users/<id>/).
    Exclusivo para usuarios con rol MANAGER.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManager]
