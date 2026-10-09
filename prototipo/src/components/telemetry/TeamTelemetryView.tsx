import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VitalityBar } from '../common/VitalityBar';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  ArrowRightLeft, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  Users, 
  Layers, 
  Flame,
  Coffee,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { Task } from '../../types';

export const TeamTelemetryView: React.FC = () => {
  const {
    users,
    tasks,
    isManager,
    switchUser,
    burnoutRisks,
    teamAverageEnergy,
    criticalMembersCount,
    autoSmartRebalance,
    transferTaskAssignee,
    showToast
  } = useApp();

  const [selectedTaskToTransfer, setSelectedTaskToTransfer] = useState<{ taskId: string; fromUserId: string } | null>(null);
  const [targetUserId, setTargetUserId] = useState<string>('');

  // Handle manual transfer execution
  const handleExecuteManualTransfer = () => {
    if (!selectedTaskToTransfer || !targetUserId) return;
    transferTaskAssignee(selectedTaskToTransfer.taskId, targetUserId);
    setSelectedTaskToTransfer(null);
    setTargetUserId('');
  };

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
      {/* RBAC Member Notice (if current user is MEMBER) */}
      {!isManager && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-100">Vista de Telemetría Global en Modo Lectura</h4>
              <p className="text-xs text-purple-300/80">
                Como <strong>MEMBER</strong>, puedes consultar el estado general del equipo, pero los rebalanceos de tareas y asignaciones globales requieren rol <strong>MANAGER</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchUser('usr-1')} // Switch to Dra. Elena Vance
            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 shadow transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cambiar a Dra. Elena Vance (MANAGER)</span>
          </button>
        </div>
      )}

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Promedio de Vitalidad */}
        <div className="p-4 rounded-xl bg-[#121625] border border-[#1e263c] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Vitalidad Promedio Clúster</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${
              teamAverageEnergy >= 70 ? 'text-emerald-400' : teamAverageEnergy >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {teamAverageEnergy}%
            </span>
            <span className="text-xs text-slate-400">stamina global</span>
          </div>
          <VitalityBar energy={teamAverageEnergy} size="compact" showLabel={false} showIcon={false} />
        </div>

        {/* KPI 2: Miembros en Riesgo Crítico */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          criticalMembersCount > 0 
            ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
            : 'bg-[#121625] border-[#1e263c]'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Alerta de Fatiga Severa</span>
            <AlertTriangle className={`w-4 h-4 ${criticalMembersCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${criticalMembersCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {criticalMembersCount}
            </span>
            <span className="text-xs text-slate-400">de {users.length} miembros</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {criticalMembersCount > 0 ? 'Requiere rebalanceo inmediato' : 'Sin miembros en zona roja'}
          </p>
        </div>

        {/* KPI 3: Tareas Activas en Ejecución */}
        <div className="p-4 rounded-xl bg-[#121625] border border-[#1e263c] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Carga Operativa Activa</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-300">
              {tasks.filter(t => t.status === 'EN_PROGRESO' || t.status === 'EN_REVISION').length}
            </span>
            <span className="text-xs text-slate-400">tareas en curso</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {tasks.filter(t => t.status === 'COMPLETADA').length} tareas ya completadas
          </p>
        </div>

        {/* KPI 4: Capacidad de Rebalanceo Disponible */}
        <div className="p-4 rounded-xl bg-[#121625] border border-[#1e263c] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Miembros en Peak Flow</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-300">
              {users.filter(u => u.currentEnergy >= 75).length}
            </span>
            <span className="text-xs text-slate-400">con energía &gt;75%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Listos para absorber sobrecarga
          </p>
        </div>
      </div>

      {/* Smart Rebalance Engine Banner (Manager Feature) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#131728] to-purple-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-wider">
              Algoritmo de Rebalanceo BioCluster
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            El motor de telemetría monitorea el cruce entre la curva de energía diaria y el esfuerzo de las tareas asignadas. Si un miembro supera su umbral biológico (como Alex Chen con 32% de energía), el sistema puede redistribuir tareas de forma preventiva a miembros en <em>Peak Flow</em> como Mateo Ruiz (94%).
          </p>
        </div>

        {isManager ? (
          <button
            onClick={() => autoSmartRebalance()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Ejecutar Rebalanceo Automático</span>
          </button>
        ) : (
          <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 px-3 py-2 rounded-lg border border-purple-800/40 shrink-0">
            Rebalanceo reservado a rol MANAGER
          </div>
        )}
      </div>

      {/* Team Member Telemetry Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wide">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Radar de Biometría & Sobrecarga Individual</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {users.length} Investigadores Activos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {burnoutRisks.map((assessment) => {
            const member = users.find(u => u.id === assessment.userId)!;
            const isCritical = assessment.riskLevel === 'CRITICO';
            const isWatch = assessment.riskLevel === 'VIGILANCIA';

            return (
              <div
                key={member.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCritical 
                    ? 'bg-[#18111d] border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-rose-500/20' 
                    : isWatch
                    ? 'bg-[#161622] border-amber-500/40'
                    : 'bg-[#121625] border-[#1e263d]'
                }`}
              >
                {/* Header: Avatar, Name, Role badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                        />
                        <span 
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#121625] ${
                            member.currentEnergy >= 75 ? 'bg-emerald-400' :
                            member.currentEnergy >= 40 ? 'bg-amber-400' :
                            'bg-rose-500 animate-ping'
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
                          {member.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{member.specialty}</p>
                        <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          member.role === 'MANAGER' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Risk Tag */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' :
                      isWatch ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {assessment.riskLevel}
                    </span>
                  </div>

                  {/* Energy Bar with Workload Preview */}
                  <div className="space-y-1.5 mb-4">
                    <VitalityBar 
                      energy={member.currentEnergy} 
                      workloadDrain={assessment.totalPendingEnergyDrain}
                      size="standard" 
                      showLabel={true} 
                      showIcon={true}
                      showStatusBadge={false}
                    />
                  </div>

                  {/* Biometric Breakdown pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-4">
                    <div className="p-2 rounded-lg bg-[#0b0e17] border border-slate-800/80">
                      <span className="text-slate-500 block text-[9px]">SUEÑO REGISTRADO</span>
                      <span className="text-slate-200 font-bold">{member.sleepHours} hrs</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0b0e17] border border-slate-800/80">
                      <span className="text-slate-500 block text-[9px]">ESTRÉS COGNITIVO</span>
                      <span className={`font-bold ${member.stressLevel >= 4 ? 'text-rose-400' : 'text-slate-200'}`}>
                        Nivel {member.stressLevel} / 5
                      </span>
                    </div>
                  </div>

                  {/* 5-Day Vitality History Sparkline */}
                  <div className="mb-4 p-2.5 rounded-lg bg-[#0c0f18] border border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                      <span>Historial 5 Días</span>
                      <span className="text-[9px] text-slate-400">Evolución</span>
                    </div>
                    <div className="flex items-end justify-between h-8 gap-1.5">
                      {member.energyHistory.map((hist, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div
                            className={`w-full rounded-sm transition-all duration-300 ${
                              hist.value >= 75 ? 'bg-emerald-500' : hist.value >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ height: `${hist.value}%` }}
                            title={`${hist.date}: ${hist.value}%`}
                          />
                          <span className="text-[8px] font-mono text-slate-400">{hist.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning / Recommendations message */}
                  <div className={`p-2.5 rounded-lg text-xs leading-relaxed mb-4 border ${
                    isCritical 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
                      : isWatch
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-300'
                  }`}>
                    <p className="text-[11px]">{assessment.warningMessage}</p>
                  </div>
                </div>

                {/* Active Tasks & Transfer Actions */}
                <div className="border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Tareas Activas ({assessment.assignedTasksCount})</span>
                    <span className="text-amber-400 font-bold">⚡{assessment.totalPendingEnergyDrain}% carga</span>
                  </div>

                  {/* List of active tasks with quick reassign button for Managers */}
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {assessment.transferableTasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e121d] border border-slate-800 text-xs"
                      >
                        <div className="truncate flex-1 pr-2">
                          <span className="font-mono text-[10px] text-slate-400 mr-1.5">{task.id}</span>
                          <span className="text-slate-200 text-[11px] truncate">{task.title}</span>
                        </div>

                        {isManager && (
                          <button
                            onClick={() => setSelectedTaskToTransfer({ taskId: task.id, fromUserId: member.id })}
                            className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors shrink-0 text-[10px] font-mono flex items-center gap-1"
                            title="Reasignar a otro miembro para balancear"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
                            <span>Transferir</span>
                          </button>
                        )}
                      </div>
                    ))}

                    {assessment.transferableTasks.length === 0 && (
                      <p className="text-[11px] italic text-slate-400 text-center py-2">
                        Sin tareas activas asignadas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Task Transfer Modal */}
      {selectedTaskToTransfer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a29] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                <span>Reasignación Manual de Tarea</span>
              </h3>
              <button
                onClick={() => setSelectedTaskToTransfer(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Selecciona el investigador que asumirá la tarea{' '}
              <strong className="text-indigo-300">
                {tasks.find(t => t.id === selectedTaskToTransfer.taskId)?.title} ({selectedTaskToTransfer.taskId})
              </strong>:
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-slate-400">Nuevo Asignatario:</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-[#101420] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Selecciona un miembro del clúster...</option>
                {users
                  .filter(u => u.id !== selectedTaskToTransfer.fromUserId)
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} — Vitalidad: {u.currentEnergy}% ({u.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTaskToTransfer(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteManualTransfer}
                disabled={!targetUserId}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold shadow transition-all"
              >
                Confirmar Transferencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
