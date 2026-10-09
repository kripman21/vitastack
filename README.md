# BioCluster / VitaStack Enterprise Hub

<div align="center">
  <h3>Sistema de Gestión de Tareas, Balance de Carga Biométrica y Prevención de Burnout</h3>
  <p>Plataforma full-stack con Django 5, Django REST Framework, PostgreSQL nativo, React 19 y Tailwind CSS.</p>
</div>

---

## 🚀 Descripción del Proyecto
**BioCluster** (VitaStack) es una suite integral de productividad diseñada para equipos de alta exigencia técnica. La plataforma combina la agilidad de los flujos Kanban tradicionales con un motor de **telemetría fisiológica**, calculando el desgaste energético de cada miembro y ejecutando rebalanceos inteligentes para mitigar el agotamiento operativo (*burnout*).

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** Python 3.10+ & Django 5.2 (Django REST Framework)
- **Base de Datos:** PostgreSQL 16 (Conexión nativa con `psycopg2-binary`)
- **Autenticación:** JWT con `djangorestframework-simplejwt`
- **Control de Acceso (RBAC):** Permisos granulares para roles `MANAGER` y `MEMBER`

### Frontend
- **Librería UI:** React 19 con TypeScript
- **Bundler:** Vite 8
- **Estilos:** Tailwind CSS con tokens de diseño corporativo (Linear/Todoist)
- **Iconografía:** Lucide React
- **Tipografía:** Montserrat (Google Fonts)

---

## ⚙️ Instrucciones de Instalación y Puesta en Marcha

### 1. Base de Datos PostgreSQL
Asegúrate de contar con el motor de PostgreSQL activo en el puerto `5432` y crea la base de datos:
```sql
CREATE DATABASE vitastack_db;
```

### 2. Backend (Django)
Desde la raíz del proyecto (`proyecto_04`):

```powershell
# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones y datos iniciales
python manage.py migrate
python manage.py seed_data

# Iniciar servidor
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend (React + Vite)
Desde el directorio `prototipo`:

```powershell
cd prototipo

# Instalar dependencias
npm install

# Iniciar cliente de desarrollo
npm run dev
```

El aplicativo estará disponible en `http://localhost:3000/`.

---

## 👥 Credenciales de Prueba (Seed Data)

| Usuario | Contraseña | Rol | Especialidad |
|---|---|---|---|
| `aris.thorne` | `Password123!` | MANAGER | Directora de Operaciones |
| `lucas.morales` | `Password123!` | MEMBER | Sr. Backend Specialist |
| `sofia.chen` | `Password123!` | MEMBER | Genomics Data Scientist |
| `marcos.rivas` | `Password123!` | MEMBER | Frontend Lead |
| `valeria.ortiz` | `Password123!` | MEMBER | Bio-QA Lead |

---

## 📐 Características Principales
- **Tablero General Ejecutivo:** Matriz de concentración estilo GitHub, métricas semanales y tabla interactiva con conmutador a Kanban arrastrable (*drag-and-drop*).
- **Equipo & Vitalidad:** Radar de sobrecarga y distribución de carga operativa exclusivo para líderes de equipo.
- **Mis Tareas:** Vista personalizada con comparativa de energía disponible versus demanda de tareas activas.
- **Algoritmo de Bio-Rebalance:** Detección de miembros en sobrecarga ($\ge 70\%$) y reasignación matemática hacia miembros con disponibilidad y stamina.
- **Soporte de Temas:** Modo Oscuro corporativo y Modo Claro suave (*Off-White* descansado), conservando el Sidebar azul marino oscuro permanente.
