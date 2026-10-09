import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Zap, 
  AlertCircle 
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('aris.thorne');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Por favor ingrese usuario y contraseña.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const success = await login(username.trim(), password);
      if (!success) {
        setErrorMessage('Credenciales no válidas. Verifique usuario o contraseña.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (userUsername: string) => {
    setUsername(userUsername);
    setPassword('Password123!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#070a13] relative overflow-hidden font-sans p-4">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-[#0e1424]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-7 md:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mb-1 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
              VitaStack <span className="text-blue-400">BioTask</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sistema de Gestión Operativa, Vitalidad y Prevención de Burnout
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Nombre de Usuario / Clave de Acceso
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. aris.thorne"
                  className="w-full pl-9 pr-3 py-2 bg-[#131929] border border-slate-800 focus:border-blue-500/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#131929] border border-slate-800 focus:border-blue-500/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando en PostgreSQL...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión en el Clúster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Account Selector */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="uppercase tracking-wider">Perfiles de Acceso Rápido</span>
              <span className="text-blue-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RBAC Activo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Dra. Aris Thorne', u: 'aris.thorne', role: 'Gerente (Manager)', color: 'border-blue-500/30 bg-blue-950/20 text-blue-300' },
                { name: 'Lucas Morales', u: 'lucas.morales', role: 'Sr. Backend (Sobrecarga)', color: 'border-amber-500/30 bg-amber-950/20 text-amber-300' },
                { name: 'Sofia Chen', u: 'sofia.chen', role: 'Data Scientist (Óptimo)', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300' },
                { name: 'Marcos Rivas', u: 'marcos.rivas', role: 'Frontend Lead', color: 'border-slate-700 bg-slate-800/30 text-slate-300' }
              ].map((acc) => (
                <button
                  key={acc.u}
                  type="button"
                  onClick={() => handleQuickSelect(acc.u)}
                  className={`text-left p-2 rounded-lg border ${acc.color} hover:brightness-125 transition-all text-[11px]`}
                >
                  <div className="font-semibold truncate">{acc.name}</div>
                  <div className="text-[9px] opacity-75 font-mono truncate">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-500" /> Django 5 & PostgreSQL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-500" /> SimpleJWT Sesión Segura
          </span>
        </div>
      </div>
    </div>
  );
};
