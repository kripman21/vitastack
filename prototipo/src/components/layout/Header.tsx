import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  HeartPulse, 
  Sparkles, 
  Zap, 
  X,
  Sliders,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TaskPriority, TaskTag } from '../../types';

interface HeaderProps {
  onOpenNewTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTaskModal }) => {
  const {
    activeView,
    filter,
    setFilter,
    currentUser,
    currentUserBurnoutRisk,
    criticalMembersCount,
    isManager,
    recoverEnergy
  } = useApp();

  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // View Title lookup
  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    'kanban': {
      title: 'Tablero de Control BioCluster',
      subtitle: 'Flujo Kanban ágil con impacto en biometría y esfuerzo cognitivo.'
    },
    'my-tasks': {
      title: 'Mis Tareas & Carga Asignada',
      subtitle: 'Monitoreo de tareas personales contra tu reserva de energía vital.'
    },
    'team-telemetry': {
      title: 'Telemetría de Energía & Prevención de Burnout',
      subtitle: 'Radar de salud del equipo con rebalanceo preventivo automatizado.'
    },
    'checkin': {
      title: 'Registro de Check-In Biométrico',
      subtitle: 'Sincroniza tus horas de sueño, estrés y pausas para calibrar tu stamina.'
    },
    'analytics': {
      title: 'Métricas de Sprint & Vitalidad',
      subtitle: 'Análisis de velocidad de entrega vs costo energético del clúster.'
    }
  };

  const currentViewMeta = viewTitles[activeView] || {
    title: 'BioCluster Workspace',
    subtitle: 'Gestión biotecnológica integrada.'
  };

  const priorities: Array<{ label: string; value: string }> = [
    { label: 'Todas las Prioridades', value: 'ALL' },
    { label: 'Crítica', value: 'CRITICA' },
    { label: 'Alta', value: 'ALTA' },
    { label: 'Media', value: 'MEDIA' },
    { label: 'Baja', value: 'BAJA' }
  ];

  const tags: Array<{ label: string; value: string }> = [
    { label: 'Todas las Etiquetas', value: 'ALL' },
    { label: 'Bio-Pipeline', value: 'Bio-Pipeline' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'AI Model', value: 'AI Model' },
    { label: 'Hardware', value: 'Hardware' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'Genómica', value: 'Genómica' },
    { label: 'Seguridad', value: 'Seguridad' }
  ];

  return (
    <header className="sticky top-0 z-20 flex flex-col bg-[#0b0f19]/90 backdrop-blur-md border-b border-[#1e293b]">
      {/* Critical Burnout Global Alert Bar (if current user is critical or manager sees critical team members) */}
      {currentUserBurnoutRisk?.riskLevel === 'CRITICO' && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Alerta de Sobrecarga Crítica:</strong> Tu nivel de energía ({currentUser.currentEnergy}%) está por debajo del umbral de seguridad para tus tareas activas.
            </span>
          </div>
          <button
            onClick={() => recoverEnergy(20, 'Pausa Biológica de Emergencia')}
            className="px-2.5 py-1 text-[11px] font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 rounded transition-colors"
          >
            Tomar Bio-Descanso (+20%)
          </button>
        </div>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-3.5">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            {currentViewMeta.title}
          </h1>
          <p className="text-xs text-slate-400">{currentViewMeta.subtitle}</p>
        </div>

        {/* Right Action Tools: Search, Filter, Create Task, Vitality Pill */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar tareas (BIO-XXX, título)..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-48 md:w-60 pl-9 pr-7 py-1.5 bg-[#171b26] border border-[#273042] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
            />
            {filter.search && (
              <button
                onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Popover Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFilterPopover(!showFilterPopover)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                filter.priority !== 'ALL' || filter.tag !== 'ALL'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                  : 'bg-[#171b26] text-slate-300 border-[#273042] hover:bg-[#1e2433]'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {(filter.priority !== 'ALL' || filter.tag !== 'ALL') && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>

            {/* Filter Menu Dropdown */}
            {showFilterPopover && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#171b28] border border-slate-700 rounded-xl shadow-2xl p-3 z-50 space-y-3 backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">Filtros Activos</span>
                  <button
                    onClick={() => {
                      setFilter(prev => ({ ...prev, priority: 'ALL', tag: 'ALL' }));
                      setShowFilterPopover(false);
                    }}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Restablecer
                  </button>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Prioridad</label>
                  <select
                    value={filter.priority}
                    onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-[#111622] border border-slate-700 rounded-md text-xs text-slate-200 px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tag */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Categoría / Tag</label>
                  <select
                    value={filter.tag}
                    onChange={(e) => setFilter(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full bg-[#111622] border border-slate-700 rounded-md text-xs text-slate-200 px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                  >
                    {tags.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Quick Vitality Status HUD Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141a27] border border-[#242e44]">
            <Zap className={`w-3.5 h-3.5 ${currentUser.currentEnergy < 40 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px]">Stamina:</span>
              <span className={`font-bold ${
                currentUser.currentEnergy >= 75 
                  ? 'text-emerald-400' 
                  : currentUser.currentEnergy >= 40 
                  ? 'text-amber-400' 
                  : 'text-rose-400'
              }`}>
                {currentUser.currentEnergy}%
              </span>
            </div>
          </div>

          {/* New Task Button (Primary CTA) */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>
    </header>
  );
};
