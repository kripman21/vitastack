import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, User } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Scale, 
  Bell, 
  Clock, 
  ChevronRight, 
  Filter, 
  Plus, 
  BarChart2,
  Columns,
  List,
  GripVertical,
  ArrowRight,
  Edit3
} from 'lucide-react';

interface GeneralDashboardProps {
  onOpenNewTaskModal: () => void;
  onEditTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
}

export const GeneralDashboard: React.FC<GeneralDashboardProps> = ({
  onOpenNewTaskModal,
  onEditTask,
  onViewTaskDetails
}) => {
  const { 
    currentUser, 
    users, 
    tasks, 
    viewMemberTasks, 
    autoSmartRebalance, 
    moveTask,
    isManager 
  } = useApp();

  const [dashboardViewMode, setDashboardViewMode] = useState<'table' | 'columns'>('table');

  // Upcoming pending tasks
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'COMPLETADA')
      .slice(0, 5);
  }, [tasks]);

  // GitHub-style contribution heat map data
  const columnsCount = 20;
  const heatGrid = useMemo(() => {
    const grid: number[][] = [];
    for (let row = 0; row < 7; row++) {
      const rowData: number[] = [];
      for (let col = 0; col < columnsCount; col++) {
        const val = ((row * 7 + col * 13 + 3) % 5);
        rowData.push(val);
      }
      grid.push(rowData);
    }
    return grid;
  }, []);

  // Weekly tasks completed metrics
  const weeklyData = [
    { week: 'Semana 31', completed: 28, target: 30, rate: '93%' },
    { week: 'Semana 32', completed: 34, target: 32, rate: '106%' },
    { week: 'Semana 33', completed: 41, target: 35, rate: '117%' },
    { week: 'Semana 34 (Actual)', completed: 39, target: 45, rate: '86%' }
  ];

  return (
    <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6 overflow-y-auto">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider uppercase text-blue-400 font-medium">
              Sprint 34: Bio-Sync Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Tablero General
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isManager 
              ? 'Resumen operativo de equipo y balance de carga biométrica'
              : 'Resumen operativo de tareas del proyecto y métricas de rendimiento'}
          </p>
        </div>

        {/* Right side: Burnout summary widget + Rebalance button + User controls */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Riesgo de Burnout Widget - Visible solo para el Manager */}
          {isManager && (
            <div className="p-3 rounded-md bg-[#111726] border border-slate-800 space-y-1.5 min-w-[260px]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
                  Riesgo de Burnout
                </span>
                <span className="text-slate-300 font-semibold text-[11px]">
                  {users.length} Activos
                </span>
              </div>

              {/* Segmented bar: Blue (Optimal), Slate (Attention), Red (High Risk) */}
              <div className="w-full h-1.5 rounded-sm bg-slate-900 overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '64%' }} title="7 Óptimo" />
                <div className="bg-slate-400 h-full" style={{ width: '27%' }} title="3 Atención" />
                <div className="bg-red-500 h-full" style={{ width: '9%' }} title="1 Alto Riesgo" />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 7 Óptimo
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 3 Atención
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> 1 Alto Riesgo
                </span>
              </div>
            </div>
          )}

          {/* Balancear Carga CTA Button - Visible solo para el Manager */}
          {isManager && (
            <button
              onClick={() => autoSmartRebalance()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-blue-200" />
              <span>Balancear Carga</span>
            </button>
          )}

          {/* User controls */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <ThemeToggle />
            <button className="p-2 rounded-md bg-[#131929] border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-3.5 h-3.5" />
            </button>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-md object-cover border border-slate-700"
              title={currentUser.name}
            />
          </div>
        </div>
      </div>

      {/* Section 1: Equipo a Cargo (Horizontal Member Cards) - Visible SOLO si es MANAGER */}
      {isManager && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Equipo a Cargo
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300">
                {users.length} Especialistas
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>63% Carga Media</span>
              <span className="text-slate-300 font-medium">91% Asistencia</span>
            </div>
          </div>

          {/* Member Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {users.map((member) => {
              const memberTasks = tasks.filter(t => t.assigneeId === member.id);
              const total = memberTasks.length;
              const prog = memberTasks.filter(t => t.status === 'EN_PROGRESO').length;
              const rev = memberTasks.filter(t => t.status === 'EN_REVISION').length;

              const isSobrecarga = member.burnoutScore >= 70;
              const isPrecaucion = member.burnoutScore >= 45 && member.burnoutScore < 70;

              let cardBorder = 'border-slate-800 hover:border-slate-700';
              let moodBg = 'bg-blue-950/60 border-blue-900/60 text-blue-300';

              if (isSobrecarga) {
                cardBorder = 'border-fuchsia-900/60 hover:border-fuchsia-700 bg-fuchsia-950/10';
                moodBg = 'bg-fuchsia-950/60 border-fuchsia-900/80 text-fuchsia-300 font-semibold';
              } else if (isPrecaucion) {
                cardBorder = 'border-orange-900/40 hover:border-orange-700 bg-orange-950/10';
                moodBg = 'bg-orange-950/50 border-orange-900/60 text-orange-300 font-semibold';
              } else {
                moodBg = 'bg-blue-950/50 border-blue-800/60 text-blue-300 font-medium';
              }

              return (
                <div
                  key={member.id}
                  onClick={() => viewMemberTasks(member.id)}
                  className={`p-3 rounded-md border ${cardBorder} bg-[#111726] transition-colors cursor-pointer hover:bg-[#141b2e] shadow-xs flex flex-col justify-between`}
                  title={`Ver tareas y carga de ${member.name}`}
                >
                  <div>
                    {/* Top: Avatar, Name, Role */}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-sm object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{member.specialty.split('&')[0]}</p>
                      </div>
                    </div>

                    {/* Mood Badge */}
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${moodBg}`}>
                        {member.moodLabel}
                      </span>
                    </div>

                    {/* Burnout Progress */}
                    <div className="space-y-1 mb-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">
                          Burnout: <strong className={isSobrecarga ? 'text-fuchsia-400' : 'text-slate-200'}>{member.burnoutScore}%</strong>
                        </span>
                        <span className={isSobrecarga ? 'text-fuchsia-400 font-medium' : isPrecaucion ? 'text-orange-400' : 'text-slate-300'}>
                          {member.burnoutCategory}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isSobrecarga ? 'bg-fuchsia-500' : isPrecaucion ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${member.burnoutScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats: TOTAL | PROG. | REV. */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/80 text-center font-mono">
                    <div className="bg-slate-800/30 py-1 rounded-sm border border-slate-700/40">
                      <span className="text-xs font-semibold text-slate-200 block">{total}</span>
                      <span className="text-[8px] text-slate-400 uppercase">TOTAL</span>
                    </div>
                    <div className="bg-slate-800/30 py-1 rounded-sm border border-slate-700/40">
                      <span className="text-xs font-semibold text-blue-400 block">{prog}</span>
                      <span className="text-[8px] text-slate-400 uppercase">PROG.</span>
                    </div>
                    <div className="bg-slate-800/30 py-1 rounded-sm border border-slate-700/40">
                      <span className="text-xs font-semibold text-slate-300 block">{rev}</span>
                      <span className="text-[8px] text-slate-400 uppercase">REV.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Two Columns (Mapa de Concentración de Tareas + Métricas de Rendimiento Semanal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Mapa de Concentración de Tareas (GitHub style matrix) */}
        <div className="lg:col-span-7 p-4 rounded-md bg-[#111726] border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wide">
                Mapa de Concentración de Tareas
              </h3>
              <p className="text-[11px] text-slate-400">
                Densidad de resolución operativa por jornada en el sprint
              </p>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300">
              142 tareas completadas este ciclo
            </span>
          </div>

          {/* GitHub-style Heatmap Grid */}
          <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800/80 overflow-x-auto">
            <div className="flex gap-2 min-w-[480px]">
              {/* Day Labels */}
              <div className="flex flex-col justify-between py-0.5 text-[9px] font-mono text-slate-500 select-none pr-1">
                <span>Lun</span>
                <span>Mie</span>
                <span>Vie</span>
                <span>Dom</span>
              </div>

              {/* Grid Columns */}
              <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1">
                {heatGrid.flatMap((row, rIdx) => 
                  row.map((level, cIdx) => {
                    let squareColor = 'bg-slate-900 border border-slate-800/60';
                    if (level === 1) squareColor = 'bg-blue-950 border border-blue-900/60';
                    if (level === 2) squareColor = 'bg-blue-800';
                    if (level === 3) squareColor = 'bg-blue-600';
                    if (level === 4) squareColor = 'bg-blue-400';

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-3 h-3 rounded-xs transition-colors ${squareColor}`}
                        title={`Día ${cIdx + 1}: ${level * 3} tareas completadas`}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Heatmap Footer Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2.5 border-t border-slate-800 mt-2.5">
              <span>Últimos 30 días de actividad continua</span>
              <div className="flex items-center gap-1.5">
                <span>Menos</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-900 border border-slate-800" />
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-950" />
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-800" />
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-400" />
                <span>Más</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Métricas de Carga y Rendimiento Semanal (Weekly Completed Tasks in Bars) */}
        <div className="lg:col-span-5 p-4 rounded-md bg-[#111726] border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
                <h3 className="text-xs font-semibold text-white tracking-wide">
                  Métricas de Carga y Rendimiento
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Tareas completadas de forma semanal frente al objetivo
              </p>
            </div>

            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Semanas
            </span>
          </div>

          {/* Weekly Completed Tasks Bar Chart */}
          <div className="space-y-3">
            {weeklyData.map((w, idx) => {
              const percent = Math.min(100, Math.round((w.completed / 45) * 100));
              const isCurrent = idx === 3;

              return (
                <div key={w.week} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`text-[11px] font-medium ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {w.week}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      <strong className="text-slate-200">{w.completed}</strong> / {w.target} ({w.rate})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-sm transition-all duration-300 ${
                        isCurrent ? 'bg-blue-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Capacity Overview */}
          <div className="p-2.5 rounded-sm bg-[#0b0f19] border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Backend Engineering</span>
              <span className="text-amber-400 font-semibold">88% Carga</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Algoritmos & Síntesis</span>
              <span className="text-slate-300">72% Carga</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Bio-Hardware & Sensores</span>
              <span className="text-blue-400 font-semibold">94% Óptimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Tareas Próximas a Vencer (Table matching Image 1) */}
      <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white tracking-wide">
              Tareas Próximas a Vencer
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
              5 PENDIENTES
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Tabla vs Columnas */}
            <div className="flex items-center bg-[#0b0f19] border border-slate-800 rounded-md p-0.5">
              <button
                onClick={() => setDashboardViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  dashboardViewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista Tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDashboardViewMode('columns')}
                className={`p-1.5 rounded transition-colors ${
                  dashboardViewMode === 'columns' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Vista Columnas (Kanban Arrastrable)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onOpenNewTaskModal()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Tarea</span>
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1.5 bg-[#141b2c] hover:bg-slate-800 text-slate-300 rounded-md text-xs font-mono transition-colors border border-slate-700">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        {/* Minimalist Data Table */}
        {dashboardViewMode === 'table' ? (
          <div className="overflow-x-auto border border-slate-800/80 rounded-md">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[#0d121f] border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">ID & Tarea</th>
                  <th className="py-2.5 px-3">Asignado</th>
                  <th className="py-2.5 px-3">Vencimiento</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Prioridad</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {upcomingTasks.map((task) => {
                  const assignee = users.find(u => u.id === task.assigneeId);
                  const isUrgent = task.priority === 'URGENTE' || task.priority === 'CRITICA';

                  return (
                    <tr
                      key={task.id}
                      onClick={() => onViewTaskDetails(task)}
                      className="hover:bg-[#141b2e] transition-colors cursor-pointer group"
                    >
                      {/* ID & TAREA */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                            {task.id}
                          </span>
                          <span className="font-medium text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-1 max-w-md">
                            {task.title}
                          </span>
                        </div>
                      </td>

                      {/* ASIGNADO */}
                      <td className="py-2.5 px-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-xs object-cover border border-slate-700 shrink-0"
                            />
                            <span className="text-slate-300 truncate max-w-[120px] text-[11px]">{assignee.name}</span>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              assignee.burnoutScore >= 70 ? 'bg-red-500' :
                              assignee.burnoutScore >= 45 ? 'bg-amber-400' : 'bg-blue-400'
                            }`} />
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Sin asignar</span>
                        )}
                      </td>

                      {/* VENCIMIENTO */}
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span className={isUrgent ? 'text-amber-300 font-medium' : ''}>
                            {task.vencimientoLabel || task.dueDate}
                          </span>
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {task.status === 'EN_PROGRESO' ? 'En Progreso' :
                           task.status === 'EN_REVISION' ? 'En Revisión' :
                           task.status === 'POR_HACER' ? 'Por Hacer' : 'Completada'}
                        </span>
                      </td>

                      {/* PRIORIDAD */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                          task.priority === 'URGENTE' || task.priority === 'CRITICA'
                            ? 'bg-red-950/50 text-red-300 border-red-900/60'
                            : task.priority === 'ALTA'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-900/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* ACCIÓN */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewTaskDetails(task);
                          }}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors inline-flex"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Kanban Drag-and-Drop Columns View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 items-start">
            <DashboardKanbanColumn
              title="Por Iniciar"
              status="POR_HACER"
              tasks={tasks.filter(t => t.status === 'POR_HACER' || t.status === 'BACKLOG')}
              users={users}
              moveTask={moveTask}
              onViewTaskDetails={onViewTaskDetails}
              onEditTask={onEditTask}
              onOpenNewTaskModal={onOpenNewTaskModal}
            />
            <DashboardKanbanColumn
              title="En Progreso"
              status="EN_PROGRESO"
              tasks={tasks.filter(t => t.status === 'EN_PROGRESO')}
              users={users}
              moveTask={moveTask}
              onViewTaskDetails={onViewTaskDetails}
              onEditTask={onEditTask}
              onOpenNewTaskModal={onOpenNewTaskModal}
            />
            <DashboardKanbanColumn
              title="En Revisión"
              status="EN_REVISION"
              tasks={tasks.filter(t => t.status === 'EN_REVISION')}
              users={users}
              moveTask={moveTask}
              onViewTaskDetails={onViewTaskDetails}
              onEditTask={onEditTask}
              onOpenNewTaskModal={onOpenNewTaskModal}
            />
            <DashboardKanbanColumn
              title="Completadas"
              status="COMPLETADA"
              tasks={tasks.filter(t => t.status === 'COMPLETADA')}
              users={users}
              moveTask={moveTask}
              onViewTaskDetails={onViewTaskDetails}
              onEditTask={onEditTask}
              onOpenNewTaskModal={onOpenNewTaskModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardKanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  users: User[];
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  onViewTaskDetails: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onOpenNewTaskModal: (status?: TaskStatus) => void;
}

const DashboardKanbanColumn: React.FC<DashboardKanbanColumnProps> = ({
  title,
  status,
  tasks,
  users,
  moveTask,
  onViewTaskDetails,
  onEditTask,
  onOpenNewTaskModal
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

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-md p-3 space-y-2.5 min-h-[400px] transition-all duration-150 border ${
        isDragOver
          ? 'bg-[#151d33] border-blue-500 ring-2 ring-blue-500/40'
          : 'bg-[#0d121f] border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-slate-200">{title}</h4>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onOpenNewTaskModal(status)}
          className="text-slate-400 hover:text-white p-0.5"
          title="Añadir a esta fase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => {
          const isDragging = draggedId === task.id;
          const assignee = users.find(u => u.id === task.assigneeId);

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
              className={`p-2.5 rounded bg-[#111726] border transition-all cursor-grab active:cursor-grabbing space-y-1.5 group select-none ${
                isDragging
                  ? 'opacity-40 border-blue-500/50 scale-[0.98]'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-[#141b2e]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <span className="font-mono text-[10px] font-medium text-slate-400">{task.id}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                  task.priority === 'CRITICA' || task.priority === 'URGENTE'
                    ? 'bg-red-950/60 text-red-300 border-red-900/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {task.priority}
                </span>
              </div>

              <h5 className="text-xs font-medium text-slate-200 group-hover:text-blue-300 line-clamp-2">
                {task.title}
              </h5>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                {assignee ? (
                  <div className="flex items-center gap-1.5">
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-4 h-4 rounded-xs object-cover border border-slate-700 shrink-0"
                    />
                    <span className="truncate max-w-[85px]">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="italic text-slate-500">Sin asignar</span>
                )}

                <div className="flex items-center gap-1.5">
                  <span>{task.vencimientoLabel || task.dueDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {isDragOver && (
          <div className="py-2.5 px-2 border-2 border-dashed border-blue-500/70 rounded-md bg-blue-500/10 text-center text-[10px] font-mono text-blue-300 animate-pulse">
            ↓ Soltar aquí para mover a {title}
          </div>
        )}

        {tasks.length === 0 && !isDragOver && (
          <div className="h-24 flex items-center justify-center border border-dashed border-slate-800 rounded text-[11px] text-slate-500">
            Sin tareas (arrastra una aquí)
          </div>
        )}
      </div>
    </div>
  );
};
