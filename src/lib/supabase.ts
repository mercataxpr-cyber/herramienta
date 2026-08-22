import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: { configKey: string; client: SupabaseClient } | null = null;

export const getSupabaseClient = (config: SupabaseConfig): SupabaseClient | null => {
  if (!config.url || !config.anonKey) return null;

  const configKey = `${config.url}_${config.anonKey}`;
  if (cachedClient && cachedClient.configKey === configKey) {
    return cachedClient.client;
  }

  try {
    const client = createClient(config.url, config.anonKey, {
      auth: { persistSession: false },
    });
    cachedClient = { configKey, client };
    return client;
  } catch (err) {
    console.error('Error al inicializar cliente de Supabase:', err);
    return null;
  }
};

export const saveAppToSupabase = async (
  config: SupabaseConfig,
  appData: { id: string; title: string; prompt: string; html: string }
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient(config);
  if (!client) {
    return { success: false, error: 'Credenciales de Supabase no configuradas' };
  }

  try {
    const payload = {
      id: appData.id || 'live-app',
      title: appData.title || 'Mi App Hazlo',
      prompt: appData.prompt || '',
      html: appData.html || '',
      updated_at: new Date().toISOString(),
    };

    // Upsert to dc_hazlo_apps table
    const { error } = await client.from('dc_hazlo_apps').upsert(payload, {
      onConflict: 'id',
    });

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Excepción Supabase:', err);
    return { success: false, error: err.message || 'Error al conectar con Supabase' };
  }
};
