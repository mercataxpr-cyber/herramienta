import React, { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RefreshCw, Smartphone, Sparkles, CheckCircle2, AlertCircle, Maximize2 } from 'lucide-react';

export const MobileLiveViewer: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [appHtml, setAppHtml] = useState<string>('');
  const [appTitle, setAppTitle] = useState<string>('Esperando app…');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'idle'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url') || '';
    const keyParam = params.get('key') || '';

    setSupabaseUrl(urlParam);
    setSupabaseKey(keyParam);

    if (!urlParam || !keyParam) {
      setStatus('error');
      setErrorMessage('Faltan los parámetros URL o Key de Supabase en el enlace.');
      return;
    }

    let client: SupabaseClient;
    try {
      client = createClient(urlParam, keyParam, {
        auth: { persistSession: false },
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(`Error de conexión: ${err.message}`);
      return;
    }

    // Function to fetch initial app state
    const fetchLatestApp = async () => {
      try {
        const { data, error } = await client
          .from('dc_hazlo_apps')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error al obtener app de Supabase:', error);
          setStatus('error');
          setErrorMessage(
            error.message.includes('relation "dc_hazlo_apps" does not exist')
              ? 'La tabla "dc_hazlo_apps" aún no ha sido creada en Supabase.'
              : error.message
          );
          return;
        }

        if (data) {
          setAppHtml(data.html || '');
          setAppTitle(data.title || 'App en vivo');
          setLastUpdated(
            data.updated_at
              ? new Date(data.updated_at).toLocaleTimeString()
              : new Date().toLocaleTimeString()
          );
        }
        setStatus('connected');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Error de lectura');
      }
    };

    fetchLatestApp();

    // Subscribe to Realtime postgres_changes
    const channel = client
      .channel('mobile-live-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dc_hazlo_apps',
        },
        (payload) => {
          console.log('⚡ Cambio en tiempo real detectado:', payload);
          const newRecord = payload.new as any;
          if (newRecord && newRecord.html) {
            setAppHtml(newRecord.html);
            if (newRecord.title) setAppTitle(newRecord.title);
            setLastUpdated(new Date().toLocaleTimeString());
            setStatus('connected');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscrito a cambios en tiempo real en Supabase');
          setStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('⚠️ Estado del canal:', status);
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0e0e11] text-white flex flex-col font-sans overflow-hidden">
      {/* MOBILE LIVE HEADER BAR */}
      <header className="h-14 bg-[#16161a] border-b border-[#2a2a35] px-4 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-lg text-[#3ecf8e]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
              {appTitle}
            </h1>
            <p className="text-[10px] text-[#8888aa] flex items-center gap-1">
              {status === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                  <span>En vivo {lastUpdated ? `(${lastUpdated})` : ''}</span>
                </>
              ) : status === 'connecting' ? (
                <>
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#6c63ff]" />
                  <span>Conectando Realtime…</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-red-400">Error de conexión</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#3ecf8e] bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 px-2 py-0.5 rounded-md">
            ⚡ Supabase
          </span>
        </div>
      </header>

      {/* CONTENT: IFRAME OR CONNECTION STATUS */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative bg-[#0e0e11]">
        {appHtml ? (
          <iframe
            title="App en vivo móvil"
            srcDoc={appHtml}
            sandbox="allow-scripts allow-forms allow-same-origin"
            className="w-full h-full border-none bg-white"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            {status === 'error' ? (
              <div className="space-y-3 max-w-sm">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 inline-block">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-sm font-bold text-white">
                  No se pudo conectar a Supabase
                </h2>
                <p className="text-xs text-[#8888aa] leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#6c63ff]/20 flex items-center justify-center mx-auto text-[#6c63ff] animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-sm font-bold text-white">
                  Esperando primera generación…
                </h2>
                <p className="text-xs text-[#8888aa] max-w-xs">
                  Genera una app desde tu computadora y se mostrará aquí automáticamente sin recargar la página.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
