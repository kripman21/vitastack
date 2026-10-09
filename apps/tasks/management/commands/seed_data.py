import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.tasks.models import Task, SubTask
from apps.vitality.models import DailyCheckIn, EnergyHistory

User = get_user_model()

class Command(BaseCommand):
    help = 'Poblar la base de datos PostgreSQL con datos idénticos de initialData.ts'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Sincronizando base de datos completa desde initialData.ts..."))

        users_payload = [
            {
                "username": "aris.thorne",
                "email": "aris.thorne@biocluster.io",
                "first_name": "Dra. Aris",
                "last_name": "Thorne",
                "role": "MANAGER",
                "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                "initials": "AT",
                "specialty": "Directora de Operaciones & Telemetría BioCluster",
                "department": "Dirección Operativa",
                "current_energy": 84,
                "burnout_score": 12,
                "burnout_category": "Bajo",
                "mood_label": "Enfocado",
                "mood_type": "enfocado",
                "sleep_hours": 8.0,
                "stress_level": 1,
                "status": "active",
                "is_staff": True,
                "is_superuser": True
            },
            {
                "username": "lucas.morales",
                "email": "lucas.morales@biocluster.io",
                "first_name": "Lucas",
                "last_name": "Morales",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                "initials": "LM",
                "specialty": "Sr. Backend Specialist",
                "department": "Backend Engineering",
                "current_energy": 22,
                "burnout_score": 78,
                "burnout_category": "Sobrecarga",
                "mood_label": "Fatiga Operativa",
                "mood_type": "burnout",
                "sleep_hours": 4.8,
                "stress_level": 5,
                "status": "deep_work",
                "is_staff": False,
                "is_superuser": False
            },
            {
                "username": "sofia.chen",
                "email": "sofia.chen@biocluster.io",
                "first_name": "Sofia",
                "last_name": "Chen",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
                "initials": "SC",
                "specialty": "Genomics Data Scientist",
                "department": "Algoritmos & Síntesis",
                "current_energy": 78,
                "burnout_score": 22,
                "burnout_category": "Saludable",
                "mood_label": "Óptimo",
                "mood_type": "optimo",
                "sleep_hours": 7.5,
                "stress_level": 2,
                "status": "active",
                "is_staff": False,
                "is_superuser": False
            },
            {
                "username": "marcos.rivas",
                "email": "marcos.rivas@biocluster.io",
                "first_name": "Marcos",
                "last_name": "Rivas",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                "initials": "MR",
                "specialty": "Frontend Lead",
                "department": "Bio-Interfaces",
                "current_energy": 45,
                "burnout_score": 55,
                "burnout_category": "Precaución",
                "mood_label": "Fatiga",
                "mood_type": "fatiga",
                "sleep_hours": 6.0,
                "stress_level": 3,
                "status": "active",
                "is_staff": False,
                "is_superuser": False
            },
            {
                "username": "valeria.ortiz",
                "email": "valeria.ortiz@biocluster.io",
                "first_name": "Dra. Valeria",
                "last_name": "Ortiz",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "initials": "VO",
                "specialty": "Bio-QA Lead",
                "department": "Compliance & Bio-QA",
                "current_energy": 82,
                "burnout_score": 18,
                "burnout_category": "Saludable",
                "mood_label": "Óptimo",
                "mood_type": "optimo",
                "sleep_hours": 7.8,
                "stress_level": 2,
                "status": "active",
                "is_staff": False,
                "is_superuser": False
            },
            {
                "username": "diego.mendez",
                "email": "diego.mendez@biocluster.io",
                "first_name": "Diego",
                "last_name": "Méndez",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
                "initials": "DM",
                "specialty": "Hardware & IoT Engineer",
                "department": "Bio-Hardware & Sensores",
                "current_energy": 66,
                "burnout_score": 34,
                "burnout_category": "Saludable",
                "mood_label": "Enfocado",
                "mood_type": "enfocado",
                "sleep_hours": 7.0,
                "stress_level": 2,
                "status": "active",
                "is_staff": False,
                "is_superuser": False
            },
            {
                "username": "camila.torres",
                "email": "camila.torres@biocluster.io",
                "first_name": "Camila",
                "last_name": "Torres",
                "role": "MEMBER",
                "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                "initials": "CT",
                "specialty": "Bioinformatics Specialist",
                "department": "Algoritmos & Síntesis",
                "current_energy": 58,
                "burnout_score": 42,
                "burnout_category": "Saludable",
                "mood_label": "Enfocado",
                "mood_type": "enfocado",
                "sleep_hours": 6.8,
                "stress_level": 3,
                "status": "active",
                "is_staff": False,
                "is_superuser": False
            }
        ]

        users_by_key = {}
        for idx, udata in enumerate(users_payload, start=1):
            username = udata.pop('username')
            email = udata.pop('email')
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': email, **udata}
            )
            user.set_password('Password123!')
            for k, v in udata.items():
                setattr(user, k, v)
            user.save()
            users_by_key[f"usr-{idx}"] = user
            users_by_key[username] = user
            self.stdout.write(f"  Usuario listo: {user.username} (usr-{idx})")

        # Historial de Energía
        today = datetime.date.today()
        for idx in range(1, 8):
            u = users_by_key.get(f"usr-{idx}")
            if not u:
                continue
            for day_offset in range(5):
                d = today - datetime.timedelta(days=4 - day_offset)
                lbl = "Hoy" if day_offset == 4 else d.strftime("%a")
                val = max(15, min(100, u.current_energy + (day_offset - 2) * 3))
                EnergyHistory.objects.update_or_create(
                    user=u,
                    date=d,
                    defaults={"value": val, "label": lbl}
                )

        # Tareas
        tasks_list = [
            {
                "task_code": "BIO-128",
                "title": "Refactorizar telemetría de pulso y batería vital",
                "description": "Actualizar controladores MQTT y optimizar serialización en búferes de baja latencia para pulso cardíaco.",
                "status": "EN_PROGRESO",
                "priority": "URGENTE",
                "assignee": users_by_key["usr-2"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 30,
                "tags": ["Bio-Pipeline", "Hardware", "Backend"],
                "due_date": today + datetime.timedelta(days=1),
                "estimated_hours": 12.0,
                "subtasks": [
                    {"title": "Comprobar frecuencia de muestreo 250Hz", "completed": True},
                    {"title": "Filtrar artefactos biométricos de ruido", "completed": False}
                ]
            },
            {
                "task_code": "BIO-142",
                "title": "Optimizar pipeline de síntesis genómica distribuida",
                "description": "Alinear particionamiento k-mer en cluster HPC Slurm reduciendo cuellos de botella en memoria.",
                "status": "EN_PROGRESO",
                "priority": "ALTA",
                "assignee": users_by_key["usr-3"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 20,
                "tags": ["Genómica", "Bio-Pipeline"],
                "due_date": today + datetime.timedelta(days=2),
                "estimated_hours": 14.0,
                "subtasks": [
                    {"title": "Descargar genoma de referencia GRCh38", "completed": True},
                    {"title": "Ejecutar benchmark de particionamiento", "completed": True}
                ]
            },
            {
                "task_code": "BIO-118",
                "title": "Validar microservicios de secuenciación con HL7 FHIR",
                "description": "Comprobar interoperabilidad con historiales clínicos electrónicos y cumplimiento de endpoints HL7 FHIR R4.",
                "status": "EN_REVISION",
                "priority": "ALTA",
                "assignee": users_by_key["usr-4"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 25,
                "tags": ["Frontend", "Seguridad"],
                "due_date": today + datetime.timedelta(days=3),
                "estimated_hours": 10.0,
                "subtasks": [
                    {"title": "Mapear recursos Observation y DiagnosticReport", "completed": True},
                    {"title": "Pruebas de compatibilidad con servidor HAPI FHIR", "completed": True}
                ]
            },
            {
                "task_code": "BIO-134",
                "title": "Implementar autenticación WebAuthn FIDO2",
                "description": "Proteger el portal de acceso con biometría de llave de seguridad hardware y passkeys.",
                "status": "POR_HACER",
                "priority": "MEDIA",
                "assignee": users_by_key["usr-2"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 15,
                "tags": ["Seguridad", "DevOps"],
                "due_date": today + datetime.timedelta(days=19),
                "estimated_hours": 8.0,
                "subtasks": [
                    {"title": "Configurar desafío WebAuthn en backend Express", "completed": False},
                    {"title": "Validar firmas criptográficas de attestación", "completed": False}
                ]
            },
            {
                "task_code": "BIO-112",
                "title": "Soporte offline para ingesta biométrica PWA",
                "description": "Almacenar en caché local con IndexedDB los registros biométricos durante pérdidas de conectividad en laboratorio.",
                "status": "EN_PROGRESO",
                "priority": "MEDIA",
                "assignee": users_by_key["usr-5"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 15,
                "tags": ["Frontend", "Hardware"],
                "due_date": today + datetime.timedelta(days=20),
                "estimated_hours": 8.0,
                "subtasks": [
                    {"title": "Configurar Service Worker Workbox", "completed": True},
                    {"title": "Mecanismo de sincronización en segundo plano", "completed": False}
                ]
            },
            {
                "task_code": "BIO-125",
                "title": "Ajuste de pools de conexión en PostgreSQL Cloud SQL",
                "description": "Configurar PgBouncer para mitigar saturación de sockets durante picos de secuenciación.",
                "status": "EN_PROGRESO",
                "priority": "ALTA",
                "assignee": users_by_key["usr-2"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 20,
                "tags": ["DevOps", "Backend"],
                "due_date": today + datetime.timedelta(days=9),
                "estimated_hours": 6.0,
                "subtasks": [
                    {"title": "Stress test con 500 conexiones concurrentes", "completed": True}
                ]
            },
            {
                "task_code": "BIO-126",
                "title": "Indexación FASTA en memoria compartida Rust",
                "description": "Reescribir parser de cabeceras en biblioteca nativa de Rust invocada por FFI.",
                "status": "EN_PROGRESO",
                "priority": "CRITICA",
                "assignee": users_by_key["usr-2"],
                "created_by": users_by_key["usr-1"],
                "energy_cost": 25,
                "tags": ["Bio-Pipeline", "Backend"],
                "due_date": today + datetime.timedelta(days=5),
                "estimated_hours": 16.0,
                "subtasks": [
                    {"title": "Zero-copy buffer allocation", "completed": True}
                ]
            },
            {
                "task_code": "BIO-127",
                "title": "Compresión de lecturas VCF con códec Zstandard",
                "description": "Reducir footprint de almacenamiento en frío para 5TB de datos genómicos.",
                "status": "EN_PROGRESO",
                "priority": "MEDIA",
                "assignee": users_by_key["usr-2"],
                "created_by": users_by_key["usr-2"],
                "energy_cost": 15,
                "tags": ["Genómica", "Backend"],
                "due_date": today + datetime.timedelta(days=13),
                "estimated_hours": 8.0,
                "subtasks": [
                    {"title": "Validar ratio de compresión > 4.2x", "completed": False}
                ]
            }
        ]

        for tdata in tasks_list:
            subtasks = tdata.pop('subtasks', [])
            task_code = tdata['task_code']
            task, _ = Task.objects.update_or_create(
                task_code=task_code,
                defaults=tdata
            )
            SubTask.objects.filter(task=task).delete()
            for st in subtasks:
                SubTask.objects.create(task=task, **st)
            self.stdout.write(f"  Tarea sincronizada: {task_code} - {task.title}")

        self.stdout.write(self.style.SUCCESS("¡Base de datos sembrada con los datos de initialData.ts!"))
