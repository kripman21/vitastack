import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  User, 
  Task, 
  DailyCheckIn, 
  BurnoutRiskAssessment, 
  AppView, 
  TaskStatus, 
  TaskPriority, 
  TaskTag,
  SubTask 
} from '../types';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CHECKINS } from '../data/initialData';
import { api } from '../services/api';

interface TaskFilter {
  search: string;
  priority: string;
  tag: string;
  assignee: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  tasks: Task[];
  checkIns: DailyCheckIn[];
  activeView: AppView;
  selectedMemberId: string | null;
  filter: TaskFilter;
  toasts: ToastMessage[];
  isManager: boolean;
  selectedTaskId: string | null;
  theme: 'dark' | 'light';
  isAuthenticated: boolean;
  
  // Auth actions
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Setters & Navigation
  setActiveView: (view: AppView) => void;
  setSelectedMemberId: (id: string | null) => void;
  viewMemberTasks: (memberId: string) => void;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilter>>;
  switchUser: (userId: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Task Actions (CRUD)
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => boolean;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // User Actions (CRUD)
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  deleteUser: (userId: string) => void;

  // Energy & Vitality
  submitDailyCheckIn: (checkInData: Omit<DailyCheckIn, 'id' | 'userId' | 'date' | 'energyCalculated'>) => void;
  recoverEnergy: (amount: number, reason: string) => void;
  autoSmartRebalance: () => { success: boolean; movedTasksCount: number; message: string };
  transferTaskAssignee: (taskId: string, newAssigneeId: string) => void;

  // RBAC Permission Helpers
  canManageTask: (task: Task) => boolean;
  canDeleteTask: (task: Task) => boolean;
  canAssignToAnyone: boolean;

  // Derived Analytics & Telemetry
  burnoutRisks: BurnoutRiskAssessment[];
  currentUserBurnoutRisk: BurnoutRiskAssessment | undefined;
  teamAverageEnergy: number;
  criticalMembersCount: number;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_USERS_KEY = 'biocluster_users_v3';
const STORAGE_TASKS_KEY = 'biocluster_tasks_v3';
const STORAGE_CHECKINS_KEY = 'biocluster_checkins_v3';
const STORAGE_CURRENT_USER_KEY = 'biocluster_current_user_v3';
const STORAGE_THEME_KEY = 'biocluster_theme_v2';
const STORAGE_AUTH_KEY = 'biocluster_is_authenticated';

// Mapeo entre IDs mock ("usr-1", etc.) y usernames de Django
const USERNAME_MAPPING: Record<string, string> = {
  'usr-1': 'aris.thorne',
  'usr-2': 'lucas.morales',
  'usr-3': 'sofia.chen',
  'usr-4': 'marcos.rivas',
  'usr-5': 'valeria.ortiz',
  'usr-6': 'diego.mendez',
  'usr-7': 'camila.torres',
};

const REVERSE_USERNAME_MAPPING: Record<string, string> = {
  'aris.thorne': 'usr-1',
  'lucas.morales': 'usr-2',
  'sofia.chen': 'usr-3',
  'marcos.rivas': 'usr-4',
  'valeria.ortiz': 'usr-5',
  'diego.mendez': 'usr-6',
  'camila.torres': 'usr-7',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current active user
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return saved || INITIAL_USERS[0].id;
    } catch {
      return INITIAL_USERS[0].id;
    }
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TASKS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Checkins
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHECKINS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
    } catch {
      return INITIAL_CHECKINS;
    }
  });

  // Navigation and Filter state
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    priority: 'ALL',
    tag: 'ALL',
    assignee: 'ALL'
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString(),
      ...toast
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Login handler
  const login = async (username: string, password = 'Password123!'): Promise<boolean> => {
    try {
      const loginRes = await api.login(username, password);
      if (loginRes && loginRes.access) {
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_AUTH_KEY, 'true');

        // Determinar ID del usuario
        const matchedId = REVERSE_USERNAME_MAPPING[username] || loginRes.user?.id || 'usr-1';
        setCurrentUserId(matchedId);
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, matchedId);

        showToast({
          type: 'success',
          title: 'Sesión Iniciada',
          message: `Bienvenido al clúster, ${loginRes.user?.name || username}.`
        });

        // Recargar datos frescos del backend
        await syncBackendData();
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Error en login:', err);
      showToast({
        type: 'error',
        title: 'Error de Autenticación',
        message: 'No fue posible iniciar sesión. Verifique sus credenciales.'
      });
      return false;
    }
  };

  // Logout handler
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_AUTH_KEY);
    api.setAccessToken(null);
    api.setRefreshToken(null);

    showToast({
      type: 'info',
      title: 'Sesión Finalizada',
      message: 'Has cerrado sesión en el clúster.'
    });
  };

  // Función para sincronizar datos con el backend de Django
  const syncBackendData = async () => {
    try {
      const [backendTasks, backendUsers] = await Promise.all([
        api.getTasks().catch(() => null),
        api.getUsers().catch(() => null)
      ]);

      if (backendUsers && Array.isArray(backendUsers) && backendUsers.length > 0) {
        const normalizedUsers: User[] = backendUsers.map((bu: any, index: number) => {
          const fallbackId = REVERSE_USERNAME_MAPPING[bu.username] || `usr-${index + 1}`;
          const fallback = INITIAL_USERS.find(u => u.email === bu.email) || INITIAL_USERS[index % INITIAL_USERS.length];
          return {
            id: fallbackId,
            name: bu.name || `${bu.first_name || ''} ${bu.last_name || ''}`.trim() || bu.username,
            email: bu.email,
            role: bu.role,
            avatar: bu.avatar || fallback?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            initials: bu.initials || (bu.first_name ? bu.first_name[0] : 'U'),
            specialty: bu.specialty || fallback?.specialty || '',
            department: bu.department || fallback?.department || '',
            currentEnergy: bu.currentEnergy ?? bu.current_energy ?? 100,
            burnoutScore: bu.burnoutScore ?? bu.burnout_score ?? 0,
            burnoutCategory: bu.burnoutCategory || bu.burnout_category || 'Saludable',
            moodLabel: bu.moodLabel || bu.mood_label || 'Enfocado',
            moodType: bu.moodType || bu.mood_type || 'enfocado',
            maxEnergy: bu.maxEnergy ?? 100,
            sleepHours: bu.sleepHours ?? bu.sleep_hours ?? 7.5,
            stressLevel: bu.stressLevel ?? bu.stress_level ?? 2,
            status: bu.status || 'active',
            lastCheckIn: bu.lastCheckIn || bu.last_check_in || new Date().toISOString(),
            energyHistory: bu.energyHistory || fallback?.energyHistory || []
          };
        });

        // Evitar duplicados por id
        const uniqueUsers = Array.from(new Map(normalizedUsers.map(u => [u.id, u])).values());
        setUsers(uniqueUsers);
      }

      if (backendTasks && Array.isArray(backendTasks) && backendTasks.length > 0) {
        const normalizedTasks: Task[] = backendTasks.map((bt: any) => {
          let resolvedAssigneeId = bt.assigneeId;
          if (bt.assignee && bt.assignee.email) {
            const matchedUser = INITIAL_USERS.find(u => u.email === bt.assignee.email);
            if (matchedUser) resolvedAssigneeId = matchedUser.id;
          }
          return {
            id: bt.task_code || bt.id,
            title: bt.title,
            description: bt.description || '',
            status: bt.status,
            priority: bt.priority,
            assigneeId: resolvedAssigneeId || 'usr-2',
            createdById: bt.createdById || 'usr-1',
            energyCost: bt.energyCost ?? bt.energy_cost ?? 15,
            tags: bt.tags || [],
            subtasks: (bt.subtasks || []).map((st: any, idx: number) => ({
              id: String(st.id || `sub-${idx}`),
              title: st.title,
              completed: Boolean(st.completed)
            })),
            dueDate: bt.dueDate || bt.due_date,
            vencimientoLabel: bt.vencimientoLabel,
            createdAt: bt.createdAt || bt.created_at || new Date().toISOString(),
            estimatedHours: bt.estimatedHours ?? bt.estimated_hours ?? 4.0,
            completedAt: bt.completedAt || bt.completed_at
          };
        });
        setTasks(normalizedTasks);
      }
    } catch (err) {
      console.warn('Conexión con Django API en segundo plano:', err);
    }
  };

  // Cargar datos al montar si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      syncBackendData();
    }
  }, [isAuthenticated]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKINS_KEY, JSON.stringify(checkIns));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [checkIns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, currentUserId);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [currentUserId]);

  // Current user object
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];
  }, [users, currentUserId]);

  const isManager = currentUser.role === 'MANAGER';
  const canAssignToAnyone = isManager;

  // Switch User (Role Simulator y re-autenticación con JWT de Django)
  const switchUser = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUserId(userId);
      showToast({
        type: 'info',
        title: `Sesión activa: ${targetUser.name}`,
        message: `Rol: ${targetUser.role === 'MANAGER' ? 'Gerente / Control Total' : 'Especialista de Laboratorio'}`
      });

      // Autenticar en backend Django
      try {
        const username = USERNAME_MAPPING[userId] || targetUser.email.split('@')[0];
        await api.login(username, 'Password123!');
      } catch (err) {
        console.warn('Fallo login automático en backend:', err);
      }
    }
  };

  // Inspect specific member tasks
  const viewMemberTasks = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveView('member-tasks');
  };

  // RBAC Permission checks
  const canManageTask = (task: Task) => {
    if (isManager) return true;
    return task.assigneeId === currentUser.id || task.createdById === currentUser.id;
  };

  const canDeleteTask = (task: Task) => {
    if (isManager) return true;
    return task.createdById === currentUser.id;
  };

  // Burnout Assessment Engine
  const burnoutRisks: BurnoutRiskAssessment[] = useMemo(() => {
    return users.map(user => {
      const activeTasks = tasks.filter(
        t => t.assigneeId === user.id && (t.status === 'EN_PROGRESO' || t.status === 'EN_REVISION')
      );
      const totalPendingEnergyDrain = activeTasks.reduce((sum, t) => sum + (t.energyCost || 10), 0);

      let riskLevel: 'NORMAL' | 'VIGILANCIA' | 'CRITICO' = 'NORMAL';
      if (user.burnoutScore >= 70 || user.currentEnergy <= 30) {
        riskLevel = 'CRITICO';
      } else if (user.burnoutScore >= 45 || user.currentEnergy <= 55) {
        riskLevel = 'VIGILANCIA';
      }

      return {
        userId: user.id,
        userName: user.name,
        currentEnergy: user.currentEnergy,
        burnoutScore: user.burnoutScore,
        assignedTasksCount: activeTasks.length,
        totalPendingEnergyDrain,
        riskScore: user.burnoutScore,
        riskLevel,
        warningMessage: riskLevel === 'CRITICO' 
          ? `Alerta crítica de burnout (${user.burnoutScore}%). Sobrecarga operativa severa.`
          : `Monitoreo estable de telemetría (${user.burnoutScore}% burnout).`,
        recommendedAction: riskLevel === 'CRITICO'
          ? 'Rebalancear tareas hacia Diego Méndez o Sofia Chen y aplicar pausa compensatoria.'
          : 'Mantener cadencia de sprint.',
        transferableTasks: activeTasks
      };
    });
  }, [users, tasks]);

  const currentUserBurnoutRisk = useMemo(() => {
    return burnoutRisks.find(b => b.userId === currentUser.id);
  }, [burnoutRisks, currentUser.id]);

  const teamAverageEnergy = useMemo(() => {
    if (users.length === 0) return 0;
    const sum = users.reduce((acc, u) => acc + u.currentEnergy, 0);
    return Math.round(sum / users.length);
  }, [users]);

  const criticalMembersCount = useMemo(() => {
    return users.filter(u => u.burnoutScore >= 70).length;
  }, [users]);

  // Task Actions
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const nextNum = tasks.length + 155;
    const tempId = `BIO-${nextNum}`;
    const newTask: Task = {
      ...taskData,
      id: tempId,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);

    showToast({
      type: 'success',
      title: 'Tarea Registrada en Clúster',
      message: `[${newTask.id}] "${newTask.title}" guardada exitosamente.`
    });

    try {
      await api.createTask({
        task_code: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        energy_cost: newTask.energyCost,
        estimated_hours: newTask.estimatedHours,
        due_date: newTask.dueDate,
        tags: newTask.tags,
        subtasks: newTask.subtasks.map(st => ({ title: st.title, completed: st.completed }))
      });
    } catch (err) {
      console.warn('Error al persistir tarea en Django:', err);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, ...updates };
        if (updates.status === 'COMPLETADA' && task.status !== 'COMPLETADA') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return task;
    }));

    showToast({
      type: 'info',
      title: 'Tarea Actualizada',
      message: `Modificaciones en [${taskId}] persistidas.`
    });

    try {
      const payload: any = {};
      if (updates.title) payload.title = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.status) payload.status = updates.status;
      if (updates.priority) payload.priority = updates.priority;
      if (updates.energyCost) payload.energy_cost = updates.energyCost;
      if (updates.dueDate) payload.due_date = updates.dueDate;
      if (updates.tags) payload.tags = updates.tags;

      await api.updateTask(taskId, payload);
    } catch (err) {
      console.warn('Error al actualizar tarea en Django:', err);
    }
  };

  const deleteTask = (taskId: string): boolean => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return false;

    if (!canDeleteTask(taskToDelete)) {
      showToast({
        type: 'error',
        title: 'Permiso Denegado (RBAC)',
        message: 'Solo el creador o un MANAGER pueden eliminar tareas del sistema.'
      });
      return false;
    }

    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }

    showToast({
      type: 'warning',
      title: 'Tarea Eliminada',
      message: `[${taskId}] eliminada del clúster.`
    });

    api.deleteTask(taskId).catch(err => {
      console.warn('Error al eliminar tarea en Django:', err);
    });

    return true;
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'COMPLETADA' ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));

    if (newStatus === 'COMPLETADA' && task.assigneeId) {
      setUsers(prev => prev.map(u => {
        if (u.id === task.assigneeId) {
          return {
            ...u,
            currentEnergy: Math.min(100, u.currentEnergy + 6),
            burnoutScore: Math.max(5, u.burnoutScore - 4)
          };
        }
        return u;
      }));

      showToast({
        type: 'success',
        title: '¡Tarea Completada!',
        message: `+6% Batería Vital restaurada al asignatario.`
      });
    } else {
      showToast({
        type: 'info',
        title: 'Estado Actualizado',
        message: `[${taskId}] movida a ${newStatus.replace('_', ' ')}`
      });
    }

    try {
      await api.moveTaskStatus(taskId, newStatus);
    } catch (err) {
      console.warn('Error al mover status en Django:', err);
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return {
          ...task,
          subtasks: updatedSubtasks
        };
      }
      return task;
    }));

    if (!subtaskId.startsWith('sub-')) {
      api.toggleSubtask(subtaskId).catch(e => console.warn(e));
    }
  };

  // User CRUD
  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    showToast({
      type: 'success',
      title: 'Especialista Actualizado',
      message: 'Los datos del miembro han sido modificados correctamente.'
    });

    if (userId === currentUser.id) {
      api.updateProfile(updates).catch(e => console.warn(e));
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newId = 'usr-' + (users.length + 1);
    const newUser: User = {
      id: newId,
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    showToast({
      type: 'success',
      title: 'Nuevo Miembro Añadido',
      message: `${newUser.name} se incorporó al clúster.`
    });
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      showToast({
        type: 'error',
        title: 'Acción No Permitida',
        message: 'No puedes eliminar el usuario con la sesión activa.'
      });
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast({
      type: 'warning',
      title: 'Miembro Retirado',
      message: 'El especialista fue eliminado de la plantilla.'
    });
  };

  const transferTaskAssignee = async (taskId: string, newAssigneeId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const targetUser = users.find(u => u.id === newAssigneeId);
    if (!task || !targetUser) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigneeId: newAssigneeId } : t));

    showToast({
      type: 'success',
      title: 'Tarea Rebalanceada',
      message: `[${task.id}] asignada a ${targetUser.name}.`
    });

    try {
      const username = USERNAME_MAPPING[newAssigneeId] || targetUser.email.split('@')[0];
      await api.reassignTask(taskId, username);
    } catch (err) {
      console.warn('Error en rebalanceo Django:', err);
    }
  };

  /**
   * ============================================================================
   * ALGORITMO DE REBALANCEO INTELIGENTE DE CARGA BIOMÉTRICA (Bio-Rebalance)
   * ============================================================================
   * 1. Detecta miembros en riesgo crítico de Burnout (score >= 70%).
   * 2. Localiza especialistas receptores con capacidad ociosa (Burnout < 40% y Energía >= 65%).
   * 3. Reasigna automáticamente la tarea activa más prioritaria del miembro sobrecargado
   *    hacia el receptor con mayor energía.
   * 4. Ajusta dinámicamente los puntajes biométricos y sincroniza el cambio con la API de Django.
   */
  const autoSmartRebalance = () => {
    // 1. Filtrar usuarios en estado crítico
    const criticalUsers = users.filter(u => u.burnoutScore >= 70);
    if (criticalUsers.length === 0) {
      showToast({
        type: 'info',
        title: 'Carga Equilibrada',
        message: 'Ningún miembro se encuentra en zona de sobrecarga crítica.'
      });
      return { success: false, movedTasksCount: 0, message: 'Sin sobrecarga crítica.' };
    }

    // 2. Localizar miembros con reserva fisiológica disponible
    const availableUsers = [...users]
      .filter(u => u.burnoutScore < 40 && u.currentEnergy >= 65)
      .sort((a, b) => b.currentEnergy - a.currentEnergy);

    if (availableUsers.length === 0) {
      showToast({
        type: 'warning',
        title: 'Capacidad Limitada',
        message: 'No hay especialistas con reserva suficiente para asumir tareas.'
      });
      return { success: false, movedTasksCount: 0, message: 'Capacidad insuficiente.' };
    }

    let moved = 0;
    // 3. Iterar sobrecargados y transferir tareas activas
    criticalUsers.forEach(critUser => {
      const pendingTasks = tasks.filter(t => t.assigneeId === critUser.id && (t.status === 'EN_PROGRESO' || t.status === 'POR_HACER'));
      if (pendingTasks.length > 0) {
        const heaviest = pendingTasks[0];
        const recipient = availableUsers[moved % availableUsers.length];

        // Actualizar asignatario localmente
        setTasks(prev => prev.map(t => t.id === heaviest.id ? { ...t, assigneeId: recipient.id } : t));

        // Actualizar métricas biométricas compensatorias
        setUsers(prev => prev.map(u => {
          if (u.id === critUser.id) {
            return {
              ...u,
              burnoutScore: Math.max(30, u.burnoutScore - 20),
              currentEnergy: Math.min(100, u.currentEnergy + 15),
              moodLabel: 'Fatiga Moderada',
              moodType: 'fatiga'
            };
          }
          if (u.id === recipient.id) {
            return {
              ...u,
              burnoutScore: Math.min(60, u.burnoutScore + 10),
              currentEnergy: Math.max(30, u.currentEnergy - 8)
            };
          }
          return u;
        }));

        // Sincronizar reasignación en Django Backend
        const recipientUsername = USERNAME_MAPPING[recipient.id] || recipient.email.split('@')[0];
        api.reassignTask(heaviest.id, recipientUsername).catch(e => console.warn(e));

        moved++;
      }
    });

    showToast({
      type: 'success',
      title: 'Rebalanceo Ejecutado',
      message: `Se transfirieron ${moved} tarea(s) críticas para aliviar sobrecarga.`
    });

    return {
      success: true,
      movedTasksCount: moved,
      message: `Rebalanceo de ${moved} tareas completado.`
    };
  };

  /**
   * ============================================================================
   * RESTAURACIÓN COMPENSATORIA DE ENERGÍA
   * ============================================================================
   * Simula pausas activas, descansos y compensaciones que reducen el puntaje
   * de agotamiento e incrementan la batería vital del especialista.
   */
  const recoverEnergy = (amount: number, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const newEnergy = Math.min(100, u.currentEnergy + amount);
        const newBurnout = Math.max(5, u.burnoutScore - Math.round(amount * 0.7));
        return {
          ...u,
          currentEnergy: newEnergy,
          burnoutScore: newBurnout,
          status: amount >= 15 ? 'in_break' : u.status
        };
      }
      return u;
    }));

    showToast({
      type: 'success',
      title: `Recuperación (+${amount}% NRG)`,
      message: `${reason}. Batería vital actualizada a ${Math.min(100, currentUser.currentEnergy + amount)}%.`
    });
  };

  /**
   * ============================================================================
   * PROCESAMIENTO DE CHECK-IN BIOMÉTRICO DIARIO
   * ============================================================================
   * Ponderación matemática de tres variables clave:
   * - Sueño (45% ponderación): Base de 8 horas recomendadas.
   * - Estrés percibido (40% ponderación): Escala inversa 1-5.
   * - Hidratación (15% ponderación): Meta de 2.0 litros.
   */
  const submitDailyCheckIn = async (data: Omit<DailyCheckIn, 'id' | 'userId' | 'date' | 'energyCalculated'>) => {
    const sleepFactor = Math.min(1, data.sleepHours / 8.0) * 45;
    const stressFactor = (6 - data.stressRating) * 8;
    const hydrationFactor = data.hydrationLiters >= 2.0 ? 15 : Math.round(data.hydrationLiters * 6);
    const calculatedEnergy = Math.min(100, Math.max(15, Math.round(sleepFactor + stressFactor + hydrationFactor)));
    const calculatedBurnout = Math.max(5, Math.min(95, 100 - calculatedEnergy + (data.stressRating * 4)));

    const newCheckIn: DailyCheckIn = {
      id: 'chk-' + Date.now(),
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      energyCalculated: calculatedEnergy,
      ...data
    };

    setCheckIns(prev => [newCheckIn, ...prev]);

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          currentEnergy: calculatedEnergy,
          burnoutScore: calculatedBurnout,
          sleepHours: data.sleepHours,
          stressLevel: data.stressRating,
          lastCheckIn: new Date().toISOString(),
          energyHistory: [
            ...u.energyHistory.slice(1),
            { date: 'Hoy', value: calculatedEnergy }
          ]
        };
      }
      return u;
    }));

    showToast({
      type: 'success',
      title: 'Check-in Biométrico Sincronizado',
      message: `Nueva Vitalidad: ${calculatedEnergy}% NRG | Burnout: ${calculatedBurnout}%.`
    });

    try {
      await api.submitCheckIn(data);
    } catch (err) {
      console.warn('Error al guardar checkin en backend Django:', err);
    }
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setTasks(INITIAL_TASKS);
    setCheckIns(INITIAL_CHECKINS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setActiveView('dashboard');
    setSelectedMemberId(null);
    showToast({
      type: 'info',
      title: 'Datos Demo Restaurados',
      message: 'Se han reiniciado los miembros y tareas al estado original.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        checkIns,
        activeView,
        selectedMemberId,
        filter,
        toasts,
        isManager,
        selectedTaskId,
        isAuthenticated,
        login,
        logout,
        setActiveView,
        setSelectedMemberId,
        viewMemberTasks,
        setFilter,
        switchUser,
        setSelectedTaskId,
        dismissToast,
        showToast,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        updateUser,
        addUser,
        deleteUser,
        submitDailyCheckIn,
        recoverEnergy,
        autoSmartRebalance,
        transferTaskAssignee,
        canManageTask,
        canDeleteTask,
        canAssignToAnyone,
        burnoutRisks,
        currentUserBurnoutRisk,
        teamAverageEnergy,
        criticalMembersCount,
        resetDemoData,
        theme,
        toggleTheme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
