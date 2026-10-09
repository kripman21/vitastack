import React from 'react';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VitalityBarProps {
  energy: number;
  size?: 'compact' | 'standard' | 'large' | 'hero';
  showLabel?: boolean;
  showIcon?: boolean;
  showStatusBadge?: boolean;
  workloadDrain?: number;
  animated?: boolean;
  className?: string;
}

export const VitalityBar: React.FC<VitalityBarProps> = ({
  energy,
  size = 'standard',
  showLabel = true,
  showIcon = true,
  showStatusBadge = false,
  workloadDrain,
  className = ''
}) => {
  const clampedEnergy = Math.max(0, Math.min(100, energy));

  const isOptimal = clampedEnergy >= 75;
  const isModerate = clampedEnergy >= 40 && clampedEnergy < 75;
  const isLow = clampedEnergy < 40;

  // Corporate palette: Blue / Muted Amber / Muted Red
  let barColor = 'bg-blue-500';
  let textColor = 'text-blue-400';
  let statusText = 'Capacidad Óptima';
  let badgeClasses = 'bg-blue-950/60 text-blue-300 border-blue-900/60';

  if (isModerate) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400';
    statusText = 'Carga Elevada';
    badgeClasses = 'bg-amber-950/50 text-amber-300 border-amber-900/50';
  } else if (isLow) {
    barColor = 'bg-red-500';
    textColor = 'text-red-400';
    statusText = 'Riesgo de Burnout';
    badgeClasses = 'bg-red-950/50 text-red-300 border-red-900/60';
  }

  const heightClasses = {
    compact: 'h-2.5',
    standard: 'h-3',
    large: 'h-4',
    hero: 'h-5'
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(showLabel || showStatusBadge) && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {showIcon && (
              isLow ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              ) : isModerate ? (
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              )
            )}
            {showLabel && (
              <span className="text-slate-400 font-medium text-[11px]">
                Nivel de Energía
              </span>
            )}
            {showStatusBadge && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badgeClasses}`}>
                {statusText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {workloadDrain !== undefined && workloadDrain > 0 && (
              <span className="text-[10px] text-slate-500">
                Demanda: -{workloadDrain}%
              </span>
            )}
            <span className={`font-semibold ${textColor}`}>
              {clampedEnergy}%
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Track */}
      <div 
        className={`w-full bg-slate-900 border border-slate-800 rounded-sm overflow-hidden relative ${heightClasses[size]}`}
      >
        {workloadDrain !== undefined && workloadDrain > 0 && (
          <div
            className="absolute inset-y-0 left-0 bg-slate-800/80 pointer-events-none"
            style={{ width: `${Math.min(100, clampedEnergy + workloadDrain)}%` }}
            title={`Demanda proyectada: ${workloadDrain}%`}
          />
        )}

        <div
          className={`h-full ${barColor} transition-all duration-300 relative z-10`}
          style={{ 
            width: `${clampedEnergy}%`,
            minWidth: clampedEnergy > 0 ? '4px' : '0px'
          }}
        />
      </div>
    </div>
  );
};
