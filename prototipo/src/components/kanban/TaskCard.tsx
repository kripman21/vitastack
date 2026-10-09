import React, { useState } from 'react';
import { Task, TaskPriority } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  CheckSquare, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ArrowRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onViewDetails }) => {
  const { 
    users, 
    currentUser, 
    deleteTask, 
    moveTask, 
    canManageTask, 
    canDeleteTask, 
    isManager 
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const assignee = users.find(u => u.id === task.assigneeId);

  // Priority Styles
  const priorityConfig: Record<TaskPriority, { text: string; bg: string; border: string; label: string }> = {
    'CRITICA': { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'Crítica' },
    'URGENTE': { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/40', label: 'Urgente' },
    'ALTA': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Alta' },
    'MEDIA': { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', label: 'Media' },
    'BAJA': { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Baja' }
  };

  const priorityStyle = priorityConfig[task.priority] || priorityConfig['MEDIA'];

  // Subtask progress
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Energy color
  const isHighDrain = task.energyCost >= 25;
  const isModerateDrain = task.energyCost >= 15 && task.energyCost < 25;

  // Native HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Next status shortcut
  const getNextStatus = () => {
    if (task.status === 'BACKLOG') return 'EN_PROGRESO';
    if (task.status === 'EN_PROGRESO') return 'EN_REVISION';
    if (task.status === 'EN_REVISION') return 'COMPLETADA';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onViewDetails(task)}
      className={`group relative bg-[#131724]/90 hover:bg-[#181d2e] border border-[#212a3d] hover:border-indigo-500/40 rounded-xl p-3.5 shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none ${
        isDragging ? 'opacity-40 scale-95 border-indigo-400 shadow-xl' : 'hover:-translate-y-0.5'
      }`}
    >
      {/* Top Bar: ID, Priority, Energy Cost, and Menu */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Task ID */}
          <span className="font-mono text-[11px] font-bold text-slate-400 tracking-tight">
            {task.id}
          </span>

          {/* Priority Badge */}
          <span className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border ${priorityStyle.bg} ${priorityStyle.border} ${priorityStyle.text}`}>
            {priorityStyle.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Energy Cost Pill */}
          <span 
            className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isHighDrain 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                : isModerateDrain 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
            title={`Costo cognitivo estimado: ${task.energyCost}% stamina`}
          >
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>{task.energyCost}%</span>
          </span>

          {/* Context Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1 w-44 bg-[#1b2133] border border-slate-700 rounded-lg shadow-xl py-1 z-30 backdrop-blur-md animate-in fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                {canManageTask(task) && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(task);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Editar Tarea</span>
                  </button>
                )}

                {nextStatus && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      moveTask(task.id, nextStatus as any);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avanzar Estado</span>
                  </button>
                )}

                {canDeleteTask(task) ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      deleteTask(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-800/80"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                ) : (
                  <div className="px-3 py-1 text-[10px] text-slate-500 border-t border-slate-800/80 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Solo autor o MANAGER</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2 mb-1.5 leading-snug">
        {task.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="text-[9px] font-mono px-1.5 py-0.2 bg-[#1c2336] text-slate-300 border border-slate-700/60 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress Bar (if exists) */}
      {totalSubtasks > 0 && (
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              Subtareas
            </span>
            <span>{completedSubtasks}/{totalSubtasks} ({subtasksPercent}%)</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                subtasksPercent === 100 ? 'bg-emerald-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${subtasksPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Row: Due Date & Assignee Avatar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        {/* Due Date */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{task.dueDate}</span>
        </div>

        {/* Assignee Avatar with stamina indicator */}
        {assignee ? (
          <div 
            className="flex items-center gap-1.5 group/avatar"
            title={`${assignee.name} (Energía: ${assignee.currentEnergy}%)`}
          >
            <span className="text-[10px] text-slate-300 max-w-[80px] truncate hidden sm:inline">
              {assignee.name.split(' ')[0]}
            </span>
            <div className="relative">
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-700"
              />
              {/* Assignee Live Energy Indicator Dot */}
              <span 
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0f131d] ${
                  assignee.currentEnergy >= 75 
                    ? 'bg-emerald-400' 
                    : assignee.currentEnergy >= 40 
                    ? 'bg-amber-400' 
                    : 'bg-rose-500 animate-ping'
                }`}
              />
            </div>
          </div>
        ) : (
          <span className="text-[10px] italic text-slate-500">Sin asignar</span>
        )}
      </div>
    </div>
  );
};
