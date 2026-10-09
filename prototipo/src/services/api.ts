/**
 * ============================================================================
 * SERVICIO DE COMUNICACIÓN CON BACKEND (Django REST Framework)
 * ============================================================================
 * Este módulo gestiona las peticiones HTTP al backend de producción en Django.
 * Implementa:
 * - Inyección automática de tokens JWT (Bearer) en las cabeceras.
 * - Mecanismo de reintento automático si el Access Token expira (HTTP 401)
 *   utilizando el Refresh Token almacenado en localStorage.
 * - Normalización de datos entre los modelos de Django y las interfaces del frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiService {
  /**
   * Obtiene el token de acceso JWT del almacenamiento local.
   */
  private getAccessToken(): string | null {
    try {
      return localStorage.getItem('biocluster_access_token');
    } catch {
      return null;
    }
  }

  /**
   * Guarda o elimina el token de acceso en el almacenamiento local.
   */
  public setAccessToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem('biocluster_access_token', token);
      } else {
        localStorage.removeItem('biocluster_access_token');
      }
    } catch (e) {
      console.warn('Error saving access token', e);
    }
  }

  /**
   * Obtiene el token de refresco JWT para renovación de sesiones.
   */
  public getRefreshToken(): string | null {
    try {
      return localStorage.getItem('biocluster_refresh_token');
    } catch {
      return null;
    }
  }

  /**
   * Guarda o elimina el token de refresco en el almacenamiento local.
   */
  public setRefreshToken(token: string | null): void {
    try {
      if (token) {
        localStorage.setItem('biocluster_refresh_token', token);
      } else {
        localStorage.removeItem('biocluster_refresh_token');
      }
    } catch (e) {
      console.warn('Error saving refresh token', e);
    }
  }

  /**
   * Wrapper genérico de fetch con manejo centralizado de headers,
   * autenticación JWT y refresco automático de tokens.
   */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Si el token expira (401), intentar renovación automática con refresh token
      if (response.status === 401 && this.getRefreshToken()) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers.set('Authorization', `Bearer ${this.getAccessToken()}`);
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          if (!retryResponse.ok) {
            throw new Error(`API Error: ${retryResponse.statusText}`);
          }
          return await retryResponse.json();
        }
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error (${response.status}): ${errorBody || response.statusText}`);
      }

      // Si la respuesta no contiene cuerpo (ej: 204 No Content en DELETE o actualización)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.warn(`[API Connection] Fallo al consultar ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Solicita un nuevo access token a Django SimpleJWT usando el refresh token vigente.
   */
  private async refreshToken(): Promise<boolean> {
    const refresh = this.getRefreshToken();
    if (!refresh) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access) {
          this.setAccessToken(data.access);
          return true;
        }
      }
    } catch {
      // Fallback
    }

    this.setAccessToken(null);
    this.setRefreshToken(null);
    return false;
  }

  /**
   * ==========================================================================
   * ENDPOINTS DE AUTENTICACIÓN Y USUARIOS
   * ==========================================================================
   */

  /**
   * Inicia sesión en el backend con username y contraseña.
   * Guarda los tokens JWT (access y refresh) en localStorage.
   * @param username Nombre de usuario registrado en Django.
   * @param password Contraseña del usuario.
   */
  public async login(username: string, password = 'Password123!') {
    const data = await this.request<{ access: string; refresh: string; user: any }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.access) {
      this.setAccessToken(data.access);
      this.setRefreshToken(data.refresh);
    }
    return data;
  }

  /**
   * Obtiene la información del perfil del usuario actualmente autenticado.
   */
  public async getCurrentUser() {
    return await this.request<any>('/auth/me/');
  }

  /**
   * Obtiene el listado completo de especialistas y miembros del equipo.
   */
  public async getUsers() {
    return await this.request<any[]>('/auth/users/');
  }

  /**
   * Actualiza datos del perfil del usuario actual (nombre, especialidad, avatar).
   */
  public async updateProfile(updates: any) {
    return await this.request<any>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * ==========================================================================
   * ENDPOINTS DE GESTIÓN DE TAREAS (CRUD & RBAC)
   * ==========================================================================
   */

  /**
   * Obtiene las tareas registradas. Aplica filtro automático en backend:
   * si es MANAGER obtiene todas, si es MEMBER obtiene las asignadas.
   */
  public async getTasks() {
    return await this.request<any[]>('/tasks/');
  }

  /**
   * Crea una nueva tarea en la base de datos de Django.
   */
  public async createTask(task: any) {
    return await this.request<any>('/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  /**
   * Actualiza los campos de una tarea identificada por su código (ej: TASK-101).
   */
  public async updateTask(taskCode: string, updates: any) {
    return await this.request<any>(`/tasks/${taskCode}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Elimina una tarea del sistema. Requiere rol MANAGER en el backend.
   */
  public async deleteTask(taskCode: string) {
    return await this.request<any>(`/tasks/${taskCode}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Mueve el estado operativo de una tarea (POR_HACER, EN_PROGRESO, EN_REVISION, COMPLETADA).
   */
  public async moveTaskStatus(taskCode: string, status: string) {
    return await this.request<any>(`/tasks/${taskCode}/move-status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Reasigna una tarea a otro especialista. Exclusivo para administradores/managers.
   */
  public async reassignTask(taskCode: string, assigneeId: string) {
    return await this.request<any>(`/tasks/${taskCode}/reassign/`, {
      method: 'POST',
      body: JSON.stringify({ assigneeId }),
    });
  }

  /**
   * Alterna el estado completado/pendiente de una subtarea específica.
   */
  public async toggleSubtask(subtaskId: string) {
    return await this.request<any>(`/tasks/subtasks/${subtaskId}/toggle/`, {
      method: 'PATCH',
    });
  }

  /**
   * ==========================================================================
   * ENDPOINTS DE VITALIDAD Y MONITOREO BIOMÉTRICO
   * ==========================================================================
   */

  /**
   * Envía el check-in diario de salud/vitalidad (horas de sueño, estrés, hidratación).
   */
  public async submitCheckIn(checkInData: any) {
    return await this.request<any>('/vitality/checkin/', {
      method: 'POST',
      body: JSON.stringify({
        sleepHours: checkInData.sleepHours,
        stressRating: checkInData.stressRating,
        hydrationLiters: checkInData.hydrationLiters,
        mood: checkInData.mood,
        notes: checkInData.notes || '',
      }),
    });
  }

  /**
   * Obtiene el historial histórico de check-ins del usuario autenticado.
   */
  public async getMyEnergyHistory() {
    return await this.request<any[]>('/vitality/my-history/');
  }

  /**
   * Obtiene las métricas globales del equipo (burnout promedio, miembros en riesgo).
   * Exclusivo para rol MANAGER en backend.
   */
  public async getTeamStatus() {
    return await this.request<any>('/vitality/team-status/');
  }
}

export const api = new ApiService();
