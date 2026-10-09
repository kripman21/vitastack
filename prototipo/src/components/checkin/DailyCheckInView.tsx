import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VitalityBar } from '../common/VitalityBar';
import { 
  HeartPulse, 
  Moon, 
  Droplets, 
  BrainCircuit, 
  Smile, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee,
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';

export const DailyCheckInView: React.FC = () => {
  const { 
    currentUser, 
    submitDailyCheckIn, 
    checkIns, 
    recoverEnergy 
  } = useApp();

  // Form State
  const [sleepHours, setSleepHours] = useState<number>(currentUser.sleepHours || 7.5);
  const [stressRating, setStressRating] = useState<1 | 2 | 3 | 4 | 5>(currentUser.stressLevel || 2);
  const [hydrationLiters, setHydrationLiters] = useState<number>(2.0);
  const [mood, setMood] = useState<'radiante' | 'estable' | 'fatigado' | 'agotado'>('estable');
  const [notes, setNotes] = useState<string>('');

  // Interactive Breathing Widget State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Sostén' | 'Exhala'>('Inhala');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState<number>(0);

  // Projected stamina calculation
  const sleepFactor = Math.min(1, sleepHours / 8.0) * 45;
  const stressFactor = (6 - stressRating) * 8;
  const hydrationFactor = hydrationLiters >= 2.0 ? 15 : Math.round(hydrationLiters * 6);
  const projectedEnergy = Math.min(100, Math.max(15, Math.round(sleepFactor + stressFactor + hydrationFactor)));

  // Guided Breathing Timer Effect (4s Inhale, 7s Hold, 8s Exhale)
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSeconds(prev => {
          if (prev > 1) return prev - 1;

          // Transition phases
          if (breathPhase === 'Inhala') {
            setBreathPhase('Sostén');
            return 7;
          } else if (breathPhase === 'Sostén') {
            setBreathPhase('Exhala');
            return 8;
          } else {
            setBreathPhase('Inhala');
            setBreathCyclesCompleted(c => {
              const nextC = c + 1;
              if (nextC % 2 === 0) {
                recoverEnergy(5, 'Ciclo de Respiración Diafragmática Completado');
              }
              return nextC;
            });
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, recoverEnergy]);

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyCheckIn({
      sleepHours,
      stressRating,
      hydrationLiters,
      mood,
      notes: notes.trim() || 'Check-in biométrico completado sin observaciones.'
    });
    setNotes('');
  };

  // Recent user check-ins
  const userCheckIns = checkIns.filter(c => c.userId === currentUser.id);

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-8">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121626] to-[#181d30] border border-[#1f283e] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">
              Protocolo de Calibración Biológica Individual
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Registra tus parámetros de descanso, hidratación y fatiga cognitiva para calibrar con precisión tu medidor de stamina. Mantener tu energía por encima del 75% desbloquea el estado <em>Peak Flow</em>.
          </p>
        </div>

        {/* Current Stamina preview */}
        <div className="p-4 rounded-xl bg-[#0b0e18] border border-slate-800 min-w-[240px]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Stamina Actual</span>
          <VitalityBar 
            energy={currentUser.currentEnergy} 
            size="large" 
            showLabel={false} 
            showIcon={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (7 cols): The Check-in Form */}
        <div className="lg:col-span-7 bg-[#121626] border border-[#1e273f] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider mb-5 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>Formulario de Estado Diario</span>
          </h3>

          <form onSubmit={handleSubmitCheckIn} className="space-y-6">
            {/* 1. Sleep Hours Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Horas de Sueño y Recuperación</span>
                </label>
                <span className="font-mono font-bold text-indigo-300 text-sm">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>3h (Severo)</span>
                <span>7.5h - 8.5h (Óptimo)</span>
                <span>12h</span>
              </div>
            </div>

            {/* 2. Cognitive Stress Level (1 to 5) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  <span>Nivel de Estrés / Carga Cognitiva</span>
                </label>
                <span className="font-mono font-bold text-purple-300 text-xs">Nivel {stressRating}/5</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const labels = ['Bajo', 'Moderado', 'Notable', 'Elevado', 'Crítico'];
                  const isSelected = stressRating === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStressRating(lvl as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected 
                          ? lvl >= 4
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                            : 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-[#161a29] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-mono">{lvl}</div>
                      <div className="text-[9px] mt-0.5 truncate">{labels[lvl - 1]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Hydration Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-300 font-medium flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Hidratación Ingerida</span>
                </label>
                <span className="font-mono font-bold text-cyan-300 text-sm">{hydrationLiters.toFixed(1)} Litros</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.25"
                value={hydrationLiters}
                onChange={(e) => setHydrationLiters(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.5L</span>
                <span>2.0L - 2.5L (Recomendado)</span>
                <span>4.0L</span>
              </div>
            </div>

            {/* 4. Mood Buttons */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-400" />
                <span>Estado de Ánimo Predominante</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'radiante', label: 'Radiante', color: 'text-emerald-400', border: 'border-emerald-500/50' },
                  { id: 'estable', label: 'Estable', color: 'text-indigo-400', border: 'border-indigo-500/50' },
                  { id: 'fatigado', label: 'Fatigado', color: 'text-amber-400', border: 'border-amber-500/50' },
                  { id: 'agotado', label: 'Agotado', color: 'text-rose-400', border: 'border-rose-500/50' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMood(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      mood === item.id 
                        ? `bg-slate-800 ${item.border} ${item.color} shadow-sm` 
                        : 'bg-[#151a28] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Notes */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Notas Biométricas o Contexto de Trabajo</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Sesión prolongada de debugging en Rust, fatiga ocular..."
                rows={2}
                className="w-full bg-[#101420] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Projected Stamina Preview Box */}
            <div className="p-4 rounded-xl bg-[#0b0e17] border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Stamina Proyectada Post Check-In:</span>
                <span className={`text-xl font-bold font-mono ${
                  projectedEnergy >= 75 ? 'text-emerald-400' : projectedEnergy >= 40 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  ⚡ {projectedEnergy}% Stamina
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                Guardar Check-In Diario
              </button>
            </div>
          </form>
        </div>

        {/* Right Col (5 cols): Guided Breathing & Recovery Widget */}
        <div className="lg:col-span-5 space-y-6">
          {/* Decompression Hub */}
          <div className="bg-[#121626] border border-[#1e273f] rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Descompresión Guiada (4-7-8)</span>
              </h3>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-950/40 border border-teal-800/40 px-2 py-0.5 rounded-full">
                Bio-Recovery
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              La técnica 4-7-8 reduce el cortisol y desacelera la frecuencia cardíaca, recargando tu stamina mental en minutos.
            </p>

            {/* Breathing Animation Orb */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                {/* Outer pulsating ring */}
                <div 
                  className={`w-44 h-44 rounded-full border-2 transition-all duration-1000 flex items-center justify-center ${
                    isBreathingActive
                      ? breathPhase === 'Inhala'
                        ? 'scale-110 border-teal-400/80 bg-teal-500/10 shadow-[0_0_35px_rgba(45,212,191,0.3)]'
                        : breathPhase === 'Sostén'
                        ? 'scale-105 border-indigo-400/80 bg-indigo-500/15 shadow-[0_0_35px_rgba(99,102,241,0.3)]'
                        : 'scale-90 border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'border-slate-800 bg-[#0d101b]'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                      {isBreathingActive ? breathPhase : 'En Espera'}
                    </span>
                    <span className="text-4xl font-mono font-bold text-white">
                      {isBreathingActive ? `${breathSeconds}s` : 'Listo'}
                    </span>
                    {isBreathingActive && (
                      <span className="text-[10px] text-teal-300 font-mono mt-1">
                        Ciclos: {breathCyclesCompleted}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold shadow transition-all ${
                  isBreathingActive 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30'
                }`}
              >
                {isBreathingActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pausar Ejercicio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Iniciar Respiración (4-7-8)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => recoverEnergy(15, 'Pausa Biológica Expresa')}
                className="flex items-center gap-1.5 py-2.5 px-3 bg-[#171c2c] hover:bg-[#20273d] border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                title="Pausa biológica directa de 5 min"
              >
                <Coffee className="w-4 h-4 text-emerald-400" />
                <span>+15% Directo</span>
              </button>
            </div>
          </div>

          {/* Previous Check-in History */}
          <div className="bg-[#121626] border border-[#1e273f] rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Registros Recientes</span>
            </h4>

            <div className="space-y-2">
              {userCheckIns.length > 0 ? (
                userCheckIns.slice(0, 3).map(chk => (
                  <div key={chk.id} className="p-3 rounded-xl bg-[#0d101a] border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400 text-[11px]">{chk.date}</span>
                      <span className="text-emerald-400 font-bold">⚡ {chk.energyCalculated}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1 italic">"{chk.notes}"</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                      <span>Sueño: {chk.sleepHours}h</span>
                      <span>Estrés: {chk.stressRating}/5</span>
                      <span>Ánimo: {chk.mood}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-2">No hay registros previos aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
