import React from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { VitalityBar } from '../common/VitalityBar';
import { 
  X, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, onClose, onEdit }) => {
  const { 
    users, 
    moveTask, 
    deleteTask, 
    toggleSubtask, 
    canManageTask, 
    canDeleteTask 
  } = useApp();

  if (!task) return null;

  const assignee = users.find(u => u.id === task.assigneeId);
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const isCompleted = task.status === 'COMPLETADA';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg h-full bg-[#101524] border-l border-slate-800 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-10 duration-150"
      >
        <div className="space-y-5">
          {/* Top Actions: ID, Status, Close */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-800 text-slate-300 border border-slate-700">
                {task.id}
              </span>
              <span className="px-2 py-0.5 rounded-sm text-xs font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {canManageTask(task) && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  title="Editar tarea"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDeleteTask(task) && (
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    onClose();
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Priority */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                task.priority === 'CRITICA' || task.priority === 'URGENTE'
                  ? 'bg-red-950/60 text-red-300 border-red-900/60'
                  : task.priority === 'ALTA'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-900/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                Prioridad {task.priority}
              </span>
            </div>
            <h2 className="text-base font-semibold text-white leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Description */}
          <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {task.description || 'Sin descripción detallada.'}
          </div>

          {/* Cognitive Load Insight */}
          <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">
                Costo Cognitivo: {task.energyCost}%
              </span>
              <span className="text-slate-500 text-[11px]">Sprint 34</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Completar esta tarea libera carga activa del especialista y restablece vitalidad operativa.
            </p>
          </div>

          {/* Assignee & Timing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Assignee Card */}
            <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Asignado a:</span>
              {assignee ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={assignee.avatar} alt={assignee.name} className="w-7 h-7 rounded-sm object-cover" />
                    <div className="truncate">
                      <p className="text-xs font-medium text-slate-200 truncate">{assignee.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{assignee.specialty}</p>
                    </div>
                  </div>
                  <VitalityBar energy={assignee.currentEnergy} size="compact" showLabel={false} showIcon={false} />
                </div>
              ) : (
                <p className="text-xs italic text-slate-500">Sin asignar</p>
              )}
            </div>

            {/* Timing Card */}
            <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 space-y-1 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400 block">Cronograma:</span>
              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Límite: {task.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimado: {task.estimatedHours} horas</span>
              </div>
            </div>
          </div>

          {/* Interactive Subtasks Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>Subtareas ({completedSubtasks}/{task.subtasks.length})</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {task.subtasks.map(st => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(task.id, st.id)}
                  className={`p-2.5 rounded-md border flex items-center gap-2.5 cursor-pointer transition-colors ${
                    st.completed 
                      ? 'bg-[#0b0f19] border-slate-800 text-slate-400 line-through' 
                      : 'bg-[#0d121f] border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                    st.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600'
                  }`}>
                    {st.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <span className="text-xs flex-1">{st.title}</span>
                </div>
              ))}

              {task.subtasks.length === 0 && (
                <p className="text-xs italic text-slate-500 py-1">Sin subtareas registradas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer State Transition Buttons */}
        <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between gap-2">
          <button
            onClick={() => moveTask(task.id, isCompleted ? 'EN_PROGRESO' : 'COMPLETADA')}
            className={`w-full py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isCompleted 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Reabrir Tarea' : 'Marcar como Completada'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
