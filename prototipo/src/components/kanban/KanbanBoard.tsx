import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { 
  Inbox, 
  PlayCircle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Zap, 
  Layers,
  Sparkles,
  Flame
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenNewTaskModal: (status?: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onViewDetails: (task: Task) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenNewTaskModal,
  onEditTask,
  onViewDetails
}) => {
  const { tasks, moveTask, filter } = useApp();
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: ColumnConfig[] = [
    {
      id: 'BACKLOG',
      title: 'Backlog / En Espera',
      icon: Inbox,
      accentColor: 'text-slate-400',
      borderColor: 'border-slate-800',
      badgeBg: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'EN_PROGRESO',
      title: 'En Progreso Activo',
      icon: PlayCircle,
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-900/60',
      badgeBg: 'bg-indigo-950 text-indigo-300 border border-indigo-700/50'
    },
    {
      id: 'EN_REVISION',
      title: 'En Revisión Técnica',
      icon: Clock,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-900/60',
      badgeBg: 'bg-purple-950 text-purple-300 border border-purple-700/50'
    },
    {
      id: 'COMPLETADA',
      title: 'Completadas & Listas',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-900/60',
      badgeBg: 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
    }
  ];

  // Filter tasks based on search, priority, tag, assignee
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesId = task.id.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesDesc) return false;
      }

      // Priority
      if (filter.priority !== 'ALL' && task.priority !== filter.priority) {
        return false;
      }

      // Tag
      if (filter.tag !== 'ALL' && !task.tags.includes(filter.tag as any)) {
        return false;
      }

      // Assignee
      if (filter.assignee !== 'ALL' && task.assigneeId !== filter.assignee) {
        return false;
      }

      return true;
    });
  }, [tasks, filter]);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, targetStatus);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-x-auto min-h-full">
      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 min-w-[320px] max-w-[1700px] mx-auto items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const totalEnergyDrain = colTasks.reduce((acc, t) => acc + (t.energyCost || 10), 0);
          const isOver = dragOverColumn === col.id;
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col bg-[#101420] border rounded-2xl transition-all duration-200 overflow-hidden min-h-[580px] shadow-sm ${
                isOver 
                  ? 'border-indigo-400 bg-[#161c2e] ring-2 ring-indigo-500/30 scale-[1.008]' 
                  : 'border-[#1e2538]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#1c2336] bg-[#131826]/70 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.accentColor}`} />
                    <h2 className="text-xs font-bold text-slate-100 tracking-wide">
                      {col.title}
                    </h2>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${col.badgeBg}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenNewTaskModal(col.id)}
                    className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                    title={`Añadir tarea directamente a ${col.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Vitality Cost Telemetry */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#0c0f17] px-2.5 py-1 rounded-md border border-[#1b2234]">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400/30" />
                    Carga Energética Total:
                  </span>
                  <span className="font-bold text-slate-200">
                    {totalEnergyDrain}% stamina
                  </span>
                </div>
              </div>

              {/* Tasks List Drop Target */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-230px)]">
                {colTasks.length > 0 ? (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onViewDetails={onViewDetails}
                    />
                  ))
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-[#1f283c] rounded-xl p-4 text-center">
                    <Layers className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-xs font-medium text-slate-400">No hay tareas en esta fase</p>
                    <p className="text-[10px] text-slate-400 mt-1">Arrastra una tarjeta aquí para cambiar su estado</p>
                  </div>
                )}

                {/* Drop indicator outline when dragging */}
                {isOver && (
                  <div className="h-16 border-2 border-dashed border-indigo-400 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xs font-mono text-indigo-300">
                    Soltar para mover a {col.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
