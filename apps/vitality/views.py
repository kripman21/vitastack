from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Avg, Sum, Count, Q
from .models import DailyCheckIn, EnergyHistory
from .serializers import DailyCheckInSerializer, EnergyHistorySerializer
from apps.accounts.permissions import IsManager
from apps.accounts.serializers import UserSerializer

User = get_user_model()

class DailyCheckInCreateView(generics.CreateAPIView):
    """
    Registro del Check-In Diario de Salud y Vitalidad (/api/vitality/checkin/).
    Recibe métricas fisiológicas (horas de sueño, estrés, hidratación)
    y calcula automáticamente la energía neta y el impacto en burnout.
    """
    serializer_class = DailyCheckInSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EnergyHistoryListView(generics.ListAPIView):
    """
    Historial histórico de telemetría y check-ins (/api/vitality/my-history/).
    Devuelve los registros cronológicos de los últimos 30 días del usuario en sesión.
    """
    serializer_class = EnergyHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EnergyHistory.objects.filter(user=self.request.user).order_by('-date')[:30]

class TeamStatusView(APIView):
    """
    Supervisión de Salud y Telemetría Global del Equipo (/api/vitality/team-status/).
    Exclusivo para usuarios con rol MANAGER:
    - Promedio de energía de la plantilla.
    - Índice de resiliencia global frente a sobrecarga.
    - Listado de miembros en zona de riesgo crítico con recomendaciones activas.
    """
    permission_classes = [IsManager]

    def get(self, request):
        users = User.objects.all()
        user_list = UserSerializer(users, many=True).data

        # Métricas Globales del Equipo
        avg_energy = users.aggregate(Avg('current_energy'))['current_energy__avg'] or 100
        avg_burnout = users.aggregate(Avg('burnout_score'))['burnout_score__avg'] or 0
        
        # Especialistas en riesgo crítico (burnout_score >= 75 o current_energy < 30)
        critical_users = users.filter(Q(burnout_score__gte=75) | Q(current_energy__lt=30))
        critical_list = UserSerializer(critical_users, many=True).data

        # Índice de Resiliencia Global (0 a 100)
        resilience_index = max(0, min(100, int(round(avg_energy * 0.6 + (100 - avg_burnout) * 0.4))))

        # Carga de trabajo acumulada por usuario
        from apps.tasks.models import Task
        workload = []
        for u in users:
            pending_tasks = Task.objects.filter(assignee=u).exclude(status='COMPLETADA')
            total_energy_drain = pending_tasks.aggregate(Sum('energy_cost'))['energy_cost__sum'] or 0
            tasks_count = pending_tasks.count()
            
            # Evaluación de riesgo por usuario
            risk_score = min(100, int(round((u.burnout_score * 0.5) + (total_energy_drain * 0.5))))
            if risk_score >= 70:
                risk_level = 'CRITICO'
                warning_message = f"{u.first_name or u.username} presenta alta acumulación de tareas y baja batería."
                recommended_action = "Reasignar tareas de alta energía a otro miembro con batería > 70%."
            elif risk_score >= 45:
                risk_level = 'VIGILANCIA'
                warning_message = "Carga moderada con nivel de estrés en monitoreo."
                recommended_action = "Monitorear próximas entregas y asegurar pausas activas."
            else:
                risk_level = 'NORMAL'
                warning_message = "Estado óptimo de vitalidad."
                recommended_action = "Mantener asignación actual de tareas."

            workload.append({
                "userId": str(u.id),
                "userName": f"{u.first_name} {u.last_name}".strip() or u.username,
                "currentEnergy": u.current_energy,
                "burnoutScore": u.burnout_score,
                "assignedTasksCount": tasks_count,
                "totalPendingEnergyDrain": total_energy_drain,
                "riskScore": risk_score,
                "riskLevel": risk_level,
                "warningMessage": warning_message,
                "recommendedAction": recommended_action
            })

        return Response({
            "teamSize": users.count(),
            "averageEnergy": int(round(avg_energy)),
            "averageBurnout": int(round(avg_burnout)),
            "resilienceIndex": resilience_index,
            "criticalCount": len(critical_list),
            "criticalUsers": critical_list,
            "members": user_list,
            "workloadAssessment": workload
        })
