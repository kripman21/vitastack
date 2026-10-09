import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  ChevronDown, 
  Zap,
  Building2,
  LogOut
} from 'lucide-react';
import { AppView } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    users,
    activeView,
    setActiveView,
    switchUser,
    recoverEnergy,
    logout,
    isManager
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedEnergyMood, setSelectedEnergyMood] = useState<'optimo' | 'enfocado' | 'fatiga' | 'agotado'>('optimo');

  const navItems: Array<{ id: AppView; label: string; icon: React.ElementType }> = [
    {
      id: 'dashboard',
      label: 'Tablero General',
      icon: LayoutDashboard
    },
    {
      id: 'my-tasks',
      label: 'Mis Tareas',
      icon: CheckSquare
    },
    ...(isManager ? [
      {
        id: 'team' as AppView,
        label: 'Equipo & Vitalidad',
        icon: Users
      }
    ] : []),
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings
    }
  ];

  return (
    <aside className="relative z-30 flex flex-col h-screen w-64 bg-[#0d121f] border-r border-slate-800/80 select-none shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-white tracking-wide">
              BioCluster
            </h1>
            <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400 block leading-tight">
              Enterprise Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active User Selector */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full flex items-center justify-between p-2 rounded-md bg-[#131929] border border-slate-800 hover:border-slate-700 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-sm object-cover border border-slate-700 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {currentUser.role === 'MANAGER' ? 'Gerente' : 'Especialista'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* User Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#131929] border border-slate-700 rounded-md shadow-xl p-1 z-50 space-y-0.5">
              <div className="px-2 py-1 text-[10px] text-slate-400 font-mono border-b border-slate-800">
                Cambiar perfil activo:
              </div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors ${
                    u.id === currentUser.id 
                      ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30' 
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-sm object-cover shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate text-[11px]">{u.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{u.role === 'MANAGER' ? 'Gerente' : u.specialty}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                    {u.currentEnergy}%
                  </span>
                </button>
              ))}

              <div className="pt-1 mt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer: Telemetría de Energía */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0a0e18] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
            Check-in de Energía
          </span>
          <span className="text-blue-400 font-semibold text-xs">
            {currentUser.currentEnergy}% NRG
          </span>
        </div>

        {/* State options */}
        <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
          {[
            { id: 'optimo', label: 'Óptimo', activeColor: 'text-blue-400 font-semibold bg-blue-950/40' },
            { id: 'enfocado', label: 'Enfocado', activeColor: 'text-white font-semibold bg-slate-800/60' },
            { id: 'fatiga', label: 'Fatiga', activeColor: 'text-orange-400 font-semibold bg-orange-950/40' },
            { id: 'agotado', label: 'Agotado', activeColor: 'text-fuchsia-400 font-semibold bg-fuchsia-950/40' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedEnergyMood(st.id as any)}
              className={`py-1 rounded transition-colors ${
                selectedEnergyMood === st.id 
                  ? st.activeColor 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${currentUser.currentEnergy}%` }}
          />
        </div>

        {/* Sincronizar Estado */}
        <button
          onClick={() => recoverEnergy(10, 'Sincronización de estado')}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#131929] hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-md text-xs font-medium transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Sincronizar Estado</span>
        </button>

        {/* Botón Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 hover:bg-red-950/30 border border-slate-800/80 hover:border-red-500/30 text-slate-400 hover:text-red-300 rounded-md text-xs font-medium transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
