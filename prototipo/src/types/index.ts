export type UserRole = 'MANAGER' | 'MEMBER';

export type VitalityState = 'PEAK' | 'SUSTAINED' | 'BURNOUT_RISK';

export type MoodType = 'optimo' | 'enfocado' | 'fatiga' | 'burnout';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  initials: string;
  specialty: string;
  department: string;
  currentEnergy: number; // 0 to 100 (Battery / Vitalidad)
  burnoutScore: number;  // 0 to 100 (Burnout index)
  burnoutCategory: 'Bajo' | 'Saludable' | 'Precaución' | 'Sobrecarga';
  moodLabel: string;
  moodType: MoodType;
  maxEnergy: number; // 100
  sleepHours: number;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  status: 'active' | 'in_break' | 'deep_work' | 'offline';
  lastCheckIn: string; // ISO date
  energyHistory: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
}

export type TaskPriority = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAJA' | 'CRITICA';

export type TaskStatus = 'POR_HACER' | 'BACKLOG' | 'EN_PROGRESO' | 'EN_REVISION' | 'COMPLETADA';

export type TaskTag = 
  | 'Bio-Pipeline' 
  | 'Frontend' 
  | 'AI Model' 
  | 'Hardware' 
  | 'DevOps' 
  | 'Genómica' 
  | 'Seguridad'
  | 'Bio-Sync'
  | 'Backend';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string; // e.g. "BIO-128"
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string; // User ID
  createdById: string; // User ID
  energyCost: number; // 5 to 35 (%)
  tags: TaskTag[];
  subtasks: SubTask[];
  dueDate: string; // YYYY-MM-DD
  vencimientoLabel?: string; // e.g. "Mañana (Urgente)", "En 2 días"
  createdAt: string; // ISO date
  estimatedHours: number;
  completedAt?: string;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  stressRating: 1 | 2 | 3 | 4 | 5;
  hydrationLiters: number;
  mood: 'radiante' | 'estable' | 'fatigado' | 'agotado';
  notes: string;
  energyCalculated: number;
}

export interface BurnoutRiskAssessment {
  userId: string;
  userName: string;
  currentEnergy: number;
  burnoutScore: number;
  assignedTasksCount: number;
  totalPendingEnergyDrain: number;
  riskScore: number; // 0 - 100
  riskLevel: 'NORMAL' | 'VIGILANCIA' | 'CRITICO';
  warningMessage: string;
  recommendedAction: string;
  transferableTasks: Task[];
}

export type AppView = 
  | 'dashboard'
  | 'my-tasks' 
  | 'team' 
  | 'settings'
  | 'member-tasks';
