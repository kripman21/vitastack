import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Columns, 
  List, 
  LayoutGrid, 
  Clock, 
  Edit3, 
  Coffee,
  GripVertical,
  ArrowRight
} from 'lucide-react';

interface MemberDetailTasksViewProps {
  onOpenNewTaskModal: (status?: TaskStatus, defaultAssigneeId?: string) => void;
  onEditTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
}

export const MemberDetailTasksView: React.FC<MemberDetailTasksViewProps> = ({
  onOpenNewTaskModal,
  onEditTask,
  onViewTaskDetails
}) => {
  const { 
    selectedMemberId, 
    users, 
    tasks, 
    setActiveView, 
    moveTask, 
    deleteTask, 
    recoverEnergy
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'columns' | 'list' | 'grid'>('columns');

  // Selected member object
  const member = useMemo(() => {
    return users.find(u => u.id === selectedMemberId) || users[1] || users[0];
  }, [users, selectedMemberId]);

  // Tasks assigned to this specific member
  const memberTasks = useMemo(() => {
    return tasks.filter(t => t.assigneeId === member.id);
  }, [tasks, member.id]);

  const filteredTasks = useMemo(() => {
    return memberTasks.filter(t => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = t.title.toLowerCase().includes(q);
        const mId = t.id.toLowerCase().includes(q);
        const mDesc = t.description.toLowerCase().includes(q);
        if (!mTitle && !mId && !mDesc) return false;
      }
      if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) {
        return false;
      }
      return true;
    });
  }, [memberTasks, searchQuery, selectedPriority]);

  const porHacerTasks = filteredTasks.filter(t => t.status === 'POR_HACER' || t.status === 'BACKLOG');
  const enProgresoTasks = filteredTasks.filter(t => t.status === 'EN_PROGRESO');
  const enRevisionTasks = filteredTasks.filter(t => t.status === 'EN_REVISION');
  const completadasTasks = filteredTasks.filter(t => t.status === 'COMPLETADA');

  const isOverloaded = member.burnoutScore >= 70;
  const isWarning = member.burnoutScore >= 45 && member.burnoutScore < 70;

  return (
    <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-5 overflow-y-auto">
      {/* Top Navigation Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('team')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111726] hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
          <span>Volver a Equipo & Vitalidad</span>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs font-mono text-slate-400">
            Modo Inspección de Carga
          </span>
        </div>
      </div>

      {/* Specialist Profile Summary Card */}
      <div className={`p-4 rounded-md border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isOverloaded 
          ? 'bg-[#16111a] border-red-900/60' 
          : 'bg-[#111726] border-slate-800'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-sm object-cover border border-slate-700"
            />
            <span className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[8px] font-bold font-mono text-white ${
              isOverloaded ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              {member.initials}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${
                isOverloaded 
                  ? 'bg-red-950/60 text-red-300 border-red-900/70' 
                  : 'bg-blue-950/60 text-blue-300 border-blue-900/60'
              }`}>
                {member.moodLabel}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {member.department}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {member.name}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              {member.specialty} — {member.email}
            </p>
          </div>
        </div>

        {/* Burnout & Stamina Gauge */}
        <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 min-w-[280px] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Índice de Burnout</span>
            <span className={`font-semibold ${isOverloaded ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-blue-400'}`}>
              {member.burnoutScore}% ({member.burnoutCategory})
            </span>
          </div>

          <div className="w-full h-1.5 rounded-sm bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                isOverloaded ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${member.burnoutScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span>Batería: <strong className="text-slate-200">{member.currentEnergy}% NRG</strong></span>
            <span>Carga: <strong className="text-slate-300">{memberTasks.length} tareas</strong></span>
          </div>

          <button
            onClick={() => recoverEnergy(15, `Pausa aplicada a ${member.name}`)}
            className="w-full mt-1.5 py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Coffee className="w-3 h-3 text-blue-400" />
            <span>Pausa Compensatoria (+15% Batería)</span>
          </button>
        </div>
      </div>

      {/* Filter & View Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-[#111726] border border-slate-800 rounded-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Buscar tareas de ${member.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0b0f19] border border-slate-800 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0b0f19] border border-slate-800 rounded-md text-xs text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">Todas las Prioridades</option>
            <option value="CRITICA">Crítica</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-[#0b0f19] border border-slate-800 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('columns')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'columns' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Vista Columnas / Kanban"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Vista Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onOpenNewTaskModal('POR_HACER', member.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Asignar Tarea</span>
          </button>
        </div>
      </div>

      {/* Render Tasks by View Mode */}
      {viewMode === 'columns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 items-start">
          <MemberColumn
            title="Por Iniciar"
            status="POR_HACER"
            tasks={porHacerTasks}
            memberId={member.id}
            onOpenNewTaskModal={onOpenNewTaskModal}
            onEditTask={onEditTask}
            onViewTaskDetails={onViewTaskDetails}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
          <MemberColumn
            title="En Progreso"
            status="EN_PROGRESO"
            tasks={enProgresoTasks}
            memberId={member.id}
            onOpenNewTaskModal={onOpenNewTaskModal}
            onEditTask={onEditTask}
            onViewTaskDetails={onViewTaskDetails}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
          <MemberColumn
            title="En Revisión"
            status="EN_REVISION"
            tasks={enRevisionTasks}
            memberId={member.id}
            onOpenNewTaskModal={onOpenNewTaskModal}
            onEditTask={onEditTask}
            onViewTaskDetails={onViewTaskDetails}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
          <MemberColumn
            title="Completadas"
            status="COMPLETADA"
            tasks={completadasTasks}
            memberId={member.id}
            onOpenNewTaskModal={onOpenNewTaskModal}
            onEditTask={onEditTask}
            onViewTaskDetails={onViewTaskDetails}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        </div>
      )}

      {/* List Mode */}
      {viewMode === 'list' && (
        <div className="bg-[#111726] border border-slate-800 rounded-md overflow-hidden divide-y divide-slate-800">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onViewTaskDetails(task)}
                className="p-3 flex items-center justify-between gap-3 hover:bg-[#141b2e] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {task.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-medium text-slate-200 group-hover:text-blue-300 truncate">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{task.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                  <span className="text-slate-400 text-[11px]">{task.energyCost}% carga</span>
                  <span className="text-slate-400 text-[11px]">{task.dueDate}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                    {task.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No hay tareas asignadas para este especialista.
            </div>
          )}
        </div>
      )}

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onViewTaskDetails(task)}
              className="p-3.5 rounded-md bg-[#111726] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-slate-400">{task.id}</span>
                <span className="text-xs font-mono text-slate-400">{task.energyCost}% carga</span>
              </div>
              <h3 className="text-xs font-medium text-slate-200 line-clamp-2">{task.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{task.dueDate}</span>
                <span className="text-blue-400">{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MemberColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  memberId: string;
  onOpenNewTaskModal: (status?: TaskStatus, memberId?: string) => void;
  onEditTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (taskId: string) => boolean;
}

const MemberColumn: React.FC<MemberColumnProps> = ({
  title,
  status,
  tasks,
  memberId,
  onOpenNewTaskModal,
  onEditTask,
  onViewTaskDetails,
  moveTask
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const nextStatusMap: Record<TaskStatus, TaskStatus | null> = {
    'BACKLOG': 'EN_PROGRESO',
    'POR_HACER': 'EN_PROGRESO',
    'EN_PROGRESO': 'EN_REVISION',
    'EN_REVISION': 'COMPLETADA',
    'COMPLETADA': null
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-md p-3 space-y-2.5 min-h-[460px] transition-all duration-150 border ${
        isDragOver
          ? 'bg-[#151d33] border-blue-500 ring-2 ring-blue-500/40'
          : 'bg-[#111726] border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-semibold text-slate-200">{title}</h3>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onOpenNewTaskModal(status, memberId)}
          className="text-slate-400 hover:text-white p-0.5"
          title="Añadir a esta fase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => {
          const isCurrentDragging = draggedId === task.id;
          const nextStatus = nextStatusMap[task.status];

          return (
            <div
              key={task.id}
              draggable={true}
              onDragStart={(e) => {
                setDraggedId(task.id);
                e.dataTransfer.setData('text/plain', task.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={() => {
                setDraggedId(null);
                setIsDragOver(false);
              }}
              onClick={() => onViewTaskDetails(task)}
              className={`p-2.5 rounded bg-[#0b0f19] border transition-all cursor-grab active:cursor-grabbing space-y-1.5 group select-none ${
                isCurrentDragging
                  ? 'opacity-40 border-blue-500/50 scale-[0.98]'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-[#0e1424]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span className="font-mono text-[10px] font-medium text-slate-400">{task.id}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{task.energyCost}%</span>
              </div>

              <h4 className="text-xs font-medium text-slate-200 group-hover:text-blue-300 line-clamp-2">
                {task.title}
              </h4>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.vencimientoLabel || task.dueDate}
                </span>

                <div className="flex items-center gap-1">
                  {nextStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task.id, nextStatus);
                      }}
                      className="p-1 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                      title={`Avanzar a ${nextStatus.replace('_', ' ')}`}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-300"
                    title="Editar Tarea"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {isDragOver && (
          <div className="py-3 px-2 border-2 border-dashed border-blue-500/70 rounded-md bg-blue-500/10 text-center text-[11px] font-mono text-blue-300 animate-pulse">
            ↓ Soltar aquí para mover a {title}
          </div>
        )}

        {tasks.length === 0 && !isDragOver && (
          <div className="h-28 flex items-center justify-center border border-dashed border-slate-800 rounded text-[11px] text-slate-500">
            Sin tareas en esta fase (arrastra una aquí)
          </div>
        )}
      </div>
    </div>
  );
};
