import React, { useState, useEffect } from 'react';
import { Server, Database, CheckCircle2, AlertCircle, RefreshCw, Terminal, Play, Send, HardDrive, Cpu, Activity } from 'lucide-react';

interface BackendItem {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

export const BackendCard: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    uptime?: number;
    memory?: string;
    nodeVersion?: string;
    activeRoutes?: string[];
  }>({ online: false });

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<BackendItem[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'routes' | 'db' | 'tester'>('routes');

  // Custom API tester state
  const [testMethod, setTestMethod] = useState<'GET' | 'POST' | 'DELETE'>('GET');
  const [testEndpoint, setTestEndpoint] = useState('/api/backend/status');
  const [testBody, setTestBody] = useState('{\n  "nombre": "DC-haZlo App",\n  "version": "1.0"\n}');

  useEffect(() => {
    checkServerStatus();
    fetchBackendData();
  }, []);

  const checkServerStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/backend/status');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          online: true,
          uptime: data.uptime,
          memory: data.memory,
          nodeVersion: data.nodeVersion,
          activeRoutes: data.activeRoutes || [
            '/api/orchestrator/chat',
            '/api/backend/status',
            '/api/backend/data',
            '/api/github/connect',
            '/api/vercel/deploy',
            '/api/auth/codex/status',
          ],
        });
      } else {
        setServerStatus({ online: false });
      }
    } catch {
      setServerStatus({ online: false });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackendData = async () => {
    try {
      const res = await fetch('/api/backend/data');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Error fetching backend data:', e);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const res = await fetch('/api/backend/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKey, value: newValue }),
      });
      if (res.ok) {
        setNewKey('');
        setNewValue('');
        fetchBackendData();
      }
    } catch (e) {
      console.error('Error adding backend item:', e);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/backend/data?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBackendData();
      }
    } catch (e) {
      console.error('Error deleting item:', e);
    }
  };

  const handleRunApiTest = async () => {
    setIsLoading(true);
    setApiResponse('Ejecutando solicitud al backend...');
    try {
      const options: RequestInit = {
        method: testMethod,
        headers: { 'Content-Type': 'application/json' },
      };
      if (testMethod === 'POST' && testBody) {
        options.body = testBody;
      }

      const startTime = performance.now();
      const res = await fetch(testEndpoint, options);
      const duration = (performance.now() - startTime).toFixed(1);
      const data = await res.json().catch(() => ({ rawText: 'Respuesta no es JSON' }));

      setApiResponse(
        `[${res.status} ${res.statusText}] (${duration}ms)\n` + JSON.stringify(data, null, 2)
      );
    } catch (err: any) {
      setApiResponse(`Error de red / API: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#16161a] border border-[#2a2a35] rounded-[24px] p-6 sm:p-7 shadow-2xl space-y-5 transition-all">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2a35] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#6c63ff]">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">SERVIDOR BACKEND (NODE.JS + EXPRESS)</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                Puerto 3000 Activo
              </span>
            </div>
            <p className="text-xs text-[#8888aa]">
              Backend completo con endpoints REST, API Proxy y almacenamiento en servidor.
            </p>
          </div>
        </div>

        {/* STATUS & REFRESH */}
        <div className="flex items-center gap-2">
          {serverStatus.online ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Backend Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold font-mono">
              Offline
            </span>
          )}

          <button
            onClick={checkServerStatus}
            disabled={isLoading}
            className="p-1.5 bg-[#1e1e24] hover:bg-[#2a2a35] text-[#8888aa] hover:text-white rounded-lg border border-[#2a2a35] transition-colors cursor-pointer"
            title="Probar conexión con backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#0d0d0f] rounded-xl border border-[#2a2a35] space-y-1">
          <div className="text-[10px] text-[#8888aa] flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> ESTADO
          </div>
          <div className="text-white font-bold">{serverStatus.online ? '200 OK' : 'No responde'}</div>
        </div>

        <div className="p-3 bg-[#0d0d0f] rounded-xl border border-[#2a2a35] space-y-1">
          <div className="text-[10px] text-[#8888aa] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#6c63ff]" /> TIEMPO ACTIVO
          </div>
          <div className="text-white font-bold">
            {serverStatus.uptime ? `${Math.floor(serverStatus.uptime)}s` : 'Activo'}
          </div>
        </div>

        <div className="p-3 bg-[#0d0d0f] rounded-xl border border-[#2a2a35] space-y-1">
          <div className="text-[10px] text-[#8888aa] flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-amber-400" /> MEMORIA
          </div>
          <div className="text-white font-bold">{serverStatus.memory || 'Normal'}</div>
        </div>

        <div className="p-3 bg-[#0d0d0f] rounded-xl border border-[#2a2a35] space-y-1">
          <div className="text-[10px] text-[#8888aa] flex items-center gap-1">
            <Terminal className="w-3 h-3 text-blue-400" /> ENTORNO
          </div>
          <div className="text-white font-bold">Node.js Express</div>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex items-center gap-2 border-b border-[#2a2a35] pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'routes'
              ? 'bg-[#6c63ff] text-white'
              : 'bg-[#1e1e24] text-[#8888aa] hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" /> Rutas API Registradas
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'db'
              ? 'bg-[#6c63ff] text-white'
              : 'bg-[#1e1e24] text-[#8888aa] hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Base de Datos Servidor ({items.length})
        </button>

        <button
          onClick={() => setActiveTab('tester')}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tester'
              ? 'bg-[#6c63ff] text-white'
              : 'bg-[#1e1e24] text-[#8888aa] hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" /> Probador de API REST
        </button>
      </div>

      {/* TAB 1: ROUTES */}
      {activeTab === 'routes' && (
        <div className="space-y-2">
          <div className="text-xs text-[#8888aa]">
            Rutas REST activas procesadas directamente en el backend Node.js (`server.ts`):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {[
              { method: 'POST', path: '/api/orchestrator/chat', desc: 'Chat con IA (Codex, Claude, Gemini)' },
              { method: 'GET', path: '/api/backend/status', desc: 'Estado y métricas del servidor' },
              { method: 'GET/POST', path: '/api/backend/data', desc: 'Almacenamiento REST persistente' },
              { method: 'POST', path: '/api/github/connect', desc: 'Sincronización Git y GitHub Token' },
              { method: 'POST', path: '/api/vercel/deploy', desc: 'Despliegue directo a Vercel Cloud' },
              { method: 'GET', path: '/api/auth/codex/status', desc: 'Estado de autenticación del motor' },
            ].map((route, i) => (
              <div
                key={i}
                className="p-3 bg-[#0d0d0f] border border-[#2a2a35] rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      route.method.includes('POST')
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {route.method}
                  </span>
                  <span className="text-white font-bold truncate">{route.path}</span>
                </div>
                <span className="text-[10px] text-[#8888aa] truncate">{route.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE ITEMS */}
      {activeTab === 'db' && (
        <div className="space-y-4">
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Clave (ej. configuracion_app)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full sm:w-1/3 bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
            />
            <input
              type="text"
              placeholder="Valor o JSON"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full sm:w-1/2 bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555566] outline-none font-mono"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
            >
              Guardar en Backend
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-xs text-[#8888aa] italic p-3 text-center bg-[#0d0d0f] rounded-xl border border-[#2a2a35]">
                No hay registros en el almacenamiento backend. Agrega uno arriba.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#0d0d0f] border border-[#2a2a35] rounded-xl flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="truncate space-y-0.5">
                    <span className="text-[#6c63ff] font-bold">{item.key}: </span>
                    <span className="text-white">{item.value}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/30 transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: API TESTER */}
      {activeTab === 'tester' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={testMethod}
              onChange={(e) => setTestMethod(e.target.value as any)}
              className="bg-[#0d0d0f] border border-[#2a2a35] text-white font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="flex-1 w-full bg-[#0d0d0f] border border-[#2a2a35] focus:border-[#6c63ff] rounded-xl px-3 py-2 text-white outline-none"
            />

            <button
              onClick={handleRunApiTest}
              disabled={isLoading}
              className="px-4 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Request</span>
            </button>
          </div>

          {testMethod === 'POST' && (
            <div className="space-y-1">
              <span className="text-[10px] text-[#8888aa]">Body (JSON):</span>
              <textarea
                rows={3}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#2a2a35] rounded-xl p-3 text-white outline-none"
              />
            </div>
          )}

          {apiResponse && (
            <div className="p-3 bg-[#09090b] border border-[#2a2a35] rounded-xl space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold">Respuesta Backend:</span>
              <pre className="text-white text-[11px] overflow-x-auto whitespace-pre-wrap">{apiResponse}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
