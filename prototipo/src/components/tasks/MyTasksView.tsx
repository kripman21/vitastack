import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { VitalityBar } from '../common/VitalityBar';
import { 
  CheckSquare, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Filter, 
  CheckCircle, 
  ChevronRight,
  Flame,
  Coffee,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface MyTasksViewProps {
  onOpenNewTaskModal: () => void;
  onEditTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  onOpenNewTaskModal,
  onEditTask,
  onViewDetails
}) => {
  const { 
    currentUser, 
    tasks, 
    moveTask, 
    toggleSubtask, 
    recoverEnergy,
    currentUserBurnoutRisk 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // Filter tasks assigned to current user
  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assigneeId === currentUser.id);
  }, [tasks, currentUser.id]);

  const activeTasks = myTasks.filter(t => t.status !== 'COMPLETADA');
  const completedTasks = myTasks.filter(t => t.status === 'COMPLETADA');

  // Workload energy calculations
  const totalActiveDrain = activeTasks.reduce((sum, t) => sum + (t.energyCost || 10), 0);
  const isOverloaded = totalActiveDrain > currentUser.currentEnergy;
  const deficit = Math.max(0, totalActiveDrain - currentUser.currentEnergy);

  // Filtered by tab and priority
  const displayedTasks = useMemo(() => {
    let list = myTasks;
    if (activeTab === 'ACTIVE') {
      list = activeTasks;
    } else if (activeTab === 'COMPLETED') {
      list = completedTasks;
    }

    if (selectedPriority !== 'ALL') {
      list = list.filter(t => t.priority === selectedPriority);
    }

    return list;
  }, [myTasks, activeTab, selectedPriority, activeTasks, completedTasks]);

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Workload & Burnout Balance Card */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all ${
        isOverloaded 
          ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]' 
          : 'bg-[#121624] border-[#1e263c]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Índice de Sobrecarga Personal
              </span>
              {isOverloaded ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  Déficit Biológico: -{deficit}%
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Carga Sostenible
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className="text-xs font-normal text-slate-400">({currentUser.specialty})</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {isOverloaded
                ? `Tus ${activeTasks.length} tareas activas exigen ${totalActiveDrain}% de stamina, excediendo tu reserva actual de ${currentUser.currentEnergy}%. Se sugiere transferir tareas o realizar pausas de descompresión.`
                : `Tienes ${activeTasks.length} tareas activas que consumen ${totalActiveDrain}% de tu capacidad biológica diaria (${currentUser.currentEnergy}% disponible).`}
            </p>
          </div>

          {/* Quick Vitality Meter & Recovery */}
          <div className="w-full lg:w-80 p-4 rounded-xl bg-[#0b0e17] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Reserva vs Demanda</span>
              <span className="font-mono text-xs font-bold text-slate-200">
                {currentUser.currentEnergy}% disp / {totalActiveDrain}% requerido
              </span>
            </div>

            <VitalityBar 
              energy={currentUser.currentEnergy} 
              workloadDrain={totalActiveDrain}
              size="large" 
              showLabel={false} 
              showIcon={true}
            />

            <button
              onClick={() => recoverEnergy(15, 'Bio-Pausa y descompresión cognitiva')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
            >
              <Coffee className="w-4 h-4 text-emerald-400" />
              <span>Tomar Bio-Descanso (+15% Stamina)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        {/* State Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101421] border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activas ({activeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'COMPLETED'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completadas ({completedTasks.length})
          </button>
        </div>

        {/* Priority Filter and Add Task */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#121624] border border-slate-800 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todas las prioridades</option>
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea Personal</span>
          </button>
        </div>
      </div>

      {/* Task List Items */}
      <div className="space-y-3">
        {displayedTasks.length > 0 ? (
          displayedTasks.map(task => {
            const isCompleted = task.status === 'COMPLETADA';
            const completedCount = task.subtasks.filter(s => s.completed).length;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted 
                    ? 'bg-[#101420]/60 border-slate-800/80 opacity-70' 
                    : 'bg-[#121727] border-[#1e263d] hover:border-indigo-500/40 shadow-sm'
                }`}
              >
                {/* Left: Check status + Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => moveTask(task.id, isCompleted ? 'EN_PROGRESO' : 'COMPLETADA')}
                    className={`mt-0.5 p-1 rounded-lg border transition-all shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'border-slate-700 hover:border-emerald-500 text-slate-500 hover:text-emerald-400'
                    }`}
                    title={isCompleted ? 'Marcar como pendiente' : 'Completar tarea (+6% energía)'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        task.priority === 'CRITICA' ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' :
                        task.priority === 'ALTA' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                        'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.2 bg-[#1b2234] text-slate-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 
                      onClick={() => onViewDetails(task)}
                      className={`text-sm font-semibold cursor-pointer hover:text-indigo-300 transition-colors ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>

                    {/* Subtasks inline preview */}
                    {task.subtasks.length > 0 && (
                      <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="text-[11px]">Subtareas: {completedCount}/{task.subtasks.length}</span>
                        <div className="flex items-center gap-2">
                          {task.subtasks.map(st => (
                            <button
                              key={st.id}
                              onClick={() => toggleSubtask(task.id, st.id)}
                              className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                                st.completed 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 line-through' 
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              {st.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Stamina Cost + Actions */}
                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{task.energyCost}% Carga</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditTask(task)}
                      className="px-2.5 py-1.5 bg-[#1b2234] hover:bg-[#252e46] text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onViewDetails(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Ver detalles completos"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <CheckCircle className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">Bandeja despejada</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No hay tareas en esta vista. Disfruta tu reserva de vitalidad o toma una nueva asignación del backlog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
