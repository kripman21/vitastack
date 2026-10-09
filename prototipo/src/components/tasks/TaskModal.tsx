import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, TaskTag, SubTask } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Trash2, 
  CheckSquare, 
  AlertCircle
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  initialStatus?: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  initialStatus = 'POR_HACER'
}) => {
  const { 
    currentUser, 
    users, 
    addTask, 
    updateTask, 
    canAssignToAnyone 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('MEDIA');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [energyCost, setEnergyCost] = useState<number>(15);
  const [dueDate, setDueDate] = useState<string>('');
  const [estimatedHours, setEstimatedHours] = useState<number>(8);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>(['Bio-Pipeline']);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Populate fields on edit or reset on create
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssigneeId(taskToEdit.assigneeId);
      setEnergyCost(taskToEdit.energyCost);
      setDueDate(taskToEdit.dueDate);
      setEstimatedHours(taskToEdit.estimatedHours);
      setSelectedTags(taskToEdit.tags || []);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('MEDIA');
      setAssigneeId(currentUser.id);
      setEnergyCost(15);
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      setEstimatedHours(8);
      setSelectedTags(['Bio-Pipeline']);
      setSubtasks([
        { id: 'sub-' + Date.now() + '-1', title: 'Diseñar arquitectura del módulo', completed: false }
      ]);
    }
  }, [taskToEdit, initialStatus, currentUser.id, isOpen]);

  if (!isOpen) return null;

  const allTags: TaskTag[] = ['Bio-Pipeline', 'Frontend', 'AI Model', 'Hardware', 'DevOps', 'Genómica', 'Seguridad'];

  const handleToggleTag = (tag: TaskTag) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'sub-' + Date.now(), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId,
        energyCost,
        dueDate,
        estimatedHours,
        tags: selectedTags,
        subtasks
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || currentUser.id,
        createdById: currentUser.id,
        energyCost,
        dueDate,
        estimatedHours,
        tags: selectedTags,
        subtasks
      });
    }

    onClose();
  };

  const targetAssignee = users.find(u => u.id === assigneeId);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-800 rounded-md max-w-xl w-full p-5 shadow-xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wide block">
              {taskToEdit ? `Modificar Registro [${taskToEdit.id}]` : 'Nueva Tarea'}
            </span>
            <h2 className="text-sm font-semibold text-white">
              {taskToEdit ? 'Editar Tarea' : 'Crear Tarea en Clúster'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Título de la Tarea <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Optimización de Algoritmo de Alineamiento..."
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Descripción y Alcance
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalla los entregables y dependencias técnicas..."
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status and Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="POR_HACER">Por Hacer / Backlog</option>
                <option value="EN_PROGRESO">En Progreso Activo</option>
                <option value="EN_REVISION">En Revisión Técnica</option>
                <option value="COMPLETADA">Completada</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>

          {/* Assignee Selection */}
          <div className="space-y-1.5 p-3 rounded-md bg-[#0b0f19] border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Asignatario Responsable</span>
              </label>

              {!canAssignToAnyone && (
                <span className="text-[10px] font-mono text-slate-400">
                  Modo Member: Asignación propia
                </span>
              )}
            </div>

            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              disabled={!canAssignToAnyone}
              className="w-full bg-[#111726] border border-slate-700 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {canAssignToAnyone ? (
                users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — Burnout: {u.burnoutScore}% ({u.role})
                  </option>
                ))
              ) : (
                <option value={currentUser.id}>
                  {currentUser.name} (Tú)
                </option>
              )}
            </select>

            {targetAssignee && targetAssignee.burnoutScore >= 70 && (
              <div className="p-2 rounded bg-red-950/40 border border-red-900/60 text-red-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>
                  Aviso: {targetAssignee.name} se encuentra en sobrecarga ({targetAssignee.burnoutScore}% burnout).
                </span>
              </div>
            )}
          </div>

          {/* Energy Cost & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Costo Energético Estimado</span>
                <span className="font-mono text-slate-400">{energyCost}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="35"
                step="5"
                value={energyCost}
                onChange={(e) => setEnergyCost(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Fecha Límite</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Etiquetas</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'bg-[#0b0f19] border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2 p-3 rounded-md bg-[#0b0f19] border border-slate-800">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Subtareas ({subtasks.length})</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Añadir paso o entregable..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="flex-1 bg-[#111726] border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors"
              >
                Añadir
              </button>
            </div>

            <div className="space-y-1 max-h-24 overflow-y-auto">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between p-1 rounded bg-[#111726] border border-slate-800 text-xs">
                  <span className="text-slate-300 truncate pr-2 text-[11px]">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-500 hover:text-red-400 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
