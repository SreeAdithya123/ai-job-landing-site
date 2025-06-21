
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_ELEVENLABS_API_KEY: string
  readonly VITE_ELEVENLABS_AGENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
