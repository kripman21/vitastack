import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Search, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  Activity,
  Users,
  CheckCircle2,
  Layers,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface TeamVitalityViewProps {
  onOpenNewMemberModal?: () => void;
  onEditMember?: (member: User) => void;
}

export const TeamVitalityView: React.FC<TeamVitalityViewProps> = ({
  onOpenNewMemberModal,
  onEditMember
}) => {
  const {
    users,
    tasks,
    viewMemberTasks,
    autoSmartRebalance,
    recoverEnergy,
    showToast
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [fatigueLevelFilter, setFatigueLevelFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter specialists
  const filteredSpecialists = useMemo(() => {
    return users.filter(user => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const mName = user.name.toLowerCase().includes(q);
        const mSpec = user.specialty.toLowerCase().includes(q);
        if (!mName && !mSpec) return false;
      }

      if (fatigueLevelFilter !== 'ALL') {
        if (fatigueLevelFilter === 'CRITICO' && user.burnoutScore < 70) return false;
        if (fatigueLevelFilter === 'PRECAUCION' && (user.burnoutScore < 45 || user.burnoutScore >= 70)) return false;
        if (fatigueLevelFilter === 'OPTIMO' && user.burnoutScore >= 45) return false;
      }

      return true;
    });
  }, [users, searchFilter, fatigueLevelFilter]);

  const criticalCount = users.filter(u => u.burnoutScore >= 70).length;

  // Global Sprint & Team Vitality Metrics (consolidated from Analytics)
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'COMPLETADA'), [tasks]);
  const activeTasks = useMemo(() => tasks.filter(t => t.status === 'EN_PROGRESO' || t.status === 'EN_REVISION'), [tasks]);

  const totalCompletedEnergy = useMemo(() => completedTasks.reduce((sum, t) => sum + (t.energyCost || 10), 0), [completedTasks]);
  const totalActiveEnergy = useMemo(() => activeTasks.reduce((sum, t) => sum + (t.energyCost || 10), 0), [activeTasks]);
  const totalHours = useMemo(() => tasks.reduce((sum, t) => sum + (t.estimatedHours || 5), 0), [tasks]);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const resilienceScore = Math.max(0, 100 - (criticalCount * 18));

  return (
    <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-6 overflow-y-auto">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] text-blue-400 font-medium uppercase tracking-wider">
            <span>Bio-Orchestration</span>
            <span>•</span>
            <span>Ciclo Activo Sprint 44</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Equipo & Vitalidad
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Supervisión de salud fisiológica, carga operativa y estado de ánimo del equipo en tiempo real para mitigar el agotamiento técnico.
          </p>
        </div>

        {/* Top telemetry tags */}
        <div className="flex items-center flex-wrap gap-2.5">
          <ThemeToggle />

          <div className="px-3 py-1.5 rounded-md bg-[#111726] border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[9px] uppercase">Plantilla</span>
            <span className="text-slate-200 font-semibold">{users.length} Especialistas</span>
          </div>

          <div className="px-3 py-1.5 rounded-md bg-[#111726] border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[9px] uppercase">Capacidad</span>
            <span className="text-blue-400 font-semibold">Saludable: 82%</span>
          </div>

          <div className="px-3 py-1.5 rounded-md bg-red-950/40 border border-red-900/60 text-xs font-mono">
            <span className="text-red-400 block text-[9px] uppercase">Alerta Burnout</span>
            <span className="text-red-300 font-semibold">{criticalCount} en riesgo</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards: Tasa de Finalización, Esfuerzo Completado, Horas Hombre Sprint, Índice de Resiliencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tasa de Finalización */}
        <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[11px] uppercase tracking-wide">Tasa de Finalización</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {completionRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            {completedTasks.length} de {tasks.length} tareas totales
          </p>
        </div>

        {/* Esfuerzo Completado */}
        <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[11px] uppercase tracking-wide">Esfuerzo Completado</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totalCompletedEnergy}%
          </div>
          <p className="text-[11px] text-slate-400">
            {totalActiveEnergy}% en progreso activo
          </p>
        </div>

        {/* Horas Hombre Sprint */}
        <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[11px] uppercase tracking-wide">Horas Hombre Sprint</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totalHours} hrs
          </div>
          <p className="text-[11px] text-slate-400">
            Estimación acumulada
          </p>
        </div>

        {/* Índice de Resiliencia */}
        <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[11px] uppercase tracking-wide">Índice de Resiliencia</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {resilienceScore}%
          </div>
          <p className="text-[11px] text-slate-400">
            {criticalCount > 0 ? `${criticalCount} especialista(s) en sobrecarga` : 'Equipo estable y en equilibrio'}
          </p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-[#111726] border border-slate-800 rounded-md">
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nombre o especialidad..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0b0f19] border border-slate-800 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={fatigueLevelFilter}
            onChange={(e) => setFatigueLevelFilter(e.target.value)}
            className="bg-[#0b0f19] border border-slate-800 rounded-md text-xs text-slate-300 px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">Fatiga: Todos</option>
            <option value="CRITICO">Sobrecarga (&gt;70%)</option>
            <option value="PRECAUCION">Precaución (45-70%)</option>
            <option value="OPTIMO">Saludable (&lt;45%)</option>
          </select>
        </div>

        {/* View toggles & Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#0b0f19] border border-slate-800 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <List className="w-3 h-3" />
              <span>Lista</span>
            </button>
          </div>

          <button
            onClick={() => showToast({ type: 'info', title: 'Historial Registrado', message: 'Métricas de los últimos sprints analizadas.' })}
            className="px-3 py-1.5 bg-[#0b0f19] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md text-xs font-mono transition-colors"
          >
            Historial de Carga
          </button>

          <button
            onClick={() => recoverEnergy(20, 'Pausa Compensatoria')}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-900/60 text-red-300 rounded-md text-xs font-medium transition-colors"
          >
            Pausa Compensatoria
          </button>
        </div>
      </div>

      {/* Specialists Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Especialistas en Laboratorio
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {filteredSpecialists.length} Monitorizados
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click en tarjeta para ver carga asignada
          </span>
        </div>

        {/* Grid of Specialists */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecialists.map((specialist) => {
              const specTasks = tasks.filter(t => t.assigneeId === specialist.id);
              const total = specTasks.length;
              const prog = specTasks.filter(t => t.status === 'EN_PROGRESO').length;
              const rev = specTasks.filter(t => t.status === 'EN_REVISION').length;

              const isOverloaded = specialist.burnoutScore >= 70;
              const isWarning = specialist.burnoutScore >= 45 && specialist.burnoutScore < 70;

              let badgeBg = 'bg-slate-800 text-slate-200 border-slate-700';
              let cardBorder = 'border-slate-800 hover:border-slate-700';
              let statusText = specialist.moodLabel;
              let statusBg = 'bg-blue-950/60 border-blue-900/60 text-blue-300';
              let barColor = 'bg-blue-500';

              if (isOverloaded) {
                badgeBg = 'bg-red-900/70 text-red-200 border-red-800';
                cardBorder = 'border-red-900/60 bg-[#16111a] hover:border-red-800';
                statusBg = 'bg-red-950/70 border-red-900/80 text-red-300 font-medium';
                barColor = 'bg-red-500';
              } else if (isWarning) {
                badgeBg = 'bg-amber-900/60 text-amber-200 border-amber-800';
                cardBorder = 'border-amber-900/50 bg-[#14141d] hover:border-amber-800';
                statusBg = 'bg-amber-950/50 border-amber-900/60 text-amber-300';
                barColor = 'bg-amber-500';
              }

              return (
                <div
                  key={specialist.id}
                  onClick={() => viewMemberTasks(specialist.id)}
                  className={`p-4 rounded-md border ${cardBorder} bg-[#111726] transition-colors cursor-pointer hover:bg-[#141b2e] shadow-xs flex flex-col justify-between space-y-3`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-sm flex items-center justify-center font-semibold text-xs border shrink-0 ${badgeBg}`}>
                          {specialist.initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-white truncate">
                            {specialist.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 truncate">
                            {specialist.specialty}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${statusBg}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Burnout Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300">
                          Burnout: <strong>{specialist.burnoutScore}%</strong>
                        </span>
                        <span className={isOverloaded ? 'text-red-400 font-medium' : isWarning ? 'text-amber-400' : 'text-slate-400'}>
                          {specialist.burnoutCategory}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${specialist.burnoutScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Barra de Batería (Debajo de la barra de burnout) */}
                    <div className="space-y-1 pt-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-400" />
                          <span>Batería:</span>
                          <strong className="text-slate-200">{specialist.currentEnergy}%</strong>
                        </span>
                        <span className={`text-[10px] ${
                          specialist.currentEnergy >= 70 ? 'text-blue-400' : specialist.currentEnergy >= 40 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {specialist.currentEnergy >= 70 ? 'Óptima' : specialist.currentEnergy >= 40 ? 'Media' : 'Crítica'}
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            specialist.currentEnergy >= 70 
                              ? 'bg-blue-500' 
                              : specialist.currentEnergy >= 40 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${specialist.currentEnergy}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Task counts & Action button */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      <strong>{total}</strong> Tareas • {prog} Prog. • {rev} Rev.
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMemberTasks(specialist.id);
                      }}
                      className="px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white bg-[#0b0f19] hover:bg-blue-600 border border-slate-800 hover:border-blue-500 transition-colors flex items-center gap-1"
                    >
                      <span>Ver Tareas</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List Mode */
          <div className="bg-[#111726] border border-slate-800 rounded-md overflow-hidden divide-y divide-slate-800">
            {filteredSpecialists.map(specialist => {
              const specTasks = tasks.filter(t => t.assigneeId === specialist.id);
              return (
                <div
                  key={specialist.id}
                  onClick={() => viewMemberTasks(specialist.id)}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-[#141b2e] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center font-medium text-xs text-slate-200">
                      {specialist.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white group-hover:text-blue-300">
                        {specialist.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{specialist.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    {/* Burnout Bar in list */}
                    <div className="w-28 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Burnout</span>
                        <span className={specialist.burnoutScore >= 70 ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                          {specialist.burnoutScore}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${specialist.burnoutScore >= 70 ? 'bg-red-500' : specialist.burnoutScore >= 45 ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${specialist.burnoutScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Batería Bar in list */}
                    <div className="w-28 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-blue-400" />
                          <span>Batería</span>
                        </span>
                        <span className="text-slate-200 font-semibold">{specialist.currentEnergy}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
                        <div
                          className={`h-full ${specialist.currentEnergy >= 70 ? 'bg-blue-500' : specialist.currentEnergy >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${specialist.currentEnergy}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-slate-400 text-[11px] min-w-[65px] text-right">
                      <strong>{specTasks.length}</strong> Tareas
                    </span>
                    <button className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors">
                      Ver Tareas →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Recommendation Card */}
      <div className="p-4 rounded-md bg-[#111726] border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white uppercase font-mono tracking-wide">
              Recomendación de Descompresión
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl">
            Se detecta sobrecarga operativa en <strong>Lucas Morales</strong>. Se recomienda transferir tareas críticas hacia <strong>Diego Méndez</strong> o <strong>Sofia Chen</strong>.
          </p>
        </div>

        <button
          onClick={() => autoSmartRebalance()}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-colors shrink-0"
        >
          Rebalance Automático
        </button>
      </div>
    </div>
  );
};
