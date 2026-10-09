import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Settings, 
  User, 
  Bell, 
  RefreshCw, 
  Save,
  Palette
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, updateUser, resetDemoData, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [specialty, setSpecialty] = useState(currentUser.specialty);
  const [email, setEmail] = useState(currentUser.email);
  const [criticalThreshold, setCriticalThreshold] = useState(70);
  const [warningThreshold, setWarningThreshold] = useState(45);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name,
      specialty,
      email
    });
  };

  return (
    <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>Configuración del Sistema</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Parámetros operativos de usuario y umbrales de alerta.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-semibold text-white">
            Perfil de Usuario Activo
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="flex items-center gap-3 pb-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-sm object-cover border border-slate-700"
            />
            <div>
              <span className="text-xs font-medium text-white block">{currentUser.name}</span>
              <span className="text-[10px] font-mono text-slate-400">Rol: {currentUser.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Cargo Técnico</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-md p-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>

      {/* Burnout Thresholds */}
      <div className="p-4 rounded-md bg-[#111726] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-semibold text-white">
            Umbrales de Alerta de Fatiga & Burnout
          </h2>
        </div>

        <p className="text-xs text-slate-400">
          Configuración de los disparadores automáticos para emitir banderas de sobrecarga en el radar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 space-y-1.5">
            <span className="text-xs font-mono text-red-400 font-semibold block">
              Sobrecarga Crítica (&gt;={criticalThreshold}%)
            </span>
            <input
              type="range"
              min="50"
              max="90"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-sm"
            />
            <span className="text-[10px] text-slate-400 font-mono block">
              Recomienda rebalanceo forzoso de tareas.
            </span>
          </div>

          <div className="p-3 rounded-md bg-[#0b0f19] border border-slate-800 space-y-1.5">
            <span className="text-xs font-mono text-amber-400 font-semibold block">
              Alerta Preventiva (&gt;={warningThreshold}%)
            </span>
            <input
              type="range"
              min="30"
              max="65"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-sm"
            />
            <span className="text-[10px] text-slate-400 font-mono block">
              Advertencia preventiva en nuevas asignaciones.
            </span>
          </div>
        </div>
      </div>

      {/* Apariencia & Modo Oscuro */}
      <div className="p-4 rounded-md bg-[#111726] border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-semibold text-white">
              Apariencia del Sistema
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Alterna entre el modo oscuro corporativo (slate) y el modo claro.
          </p>
        </div>

        <ThemeToggle showLabel />
      </div>

      {/* Demo Reset */}
      <div className="p-4 rounded-md bg-[#111726] border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold text-white">Restablecer Datos de Demostración</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Reinicia todos los especialistas y tareas al estado original.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar Demo</span>
        </button>
      </div>
    </div>
  );
};
