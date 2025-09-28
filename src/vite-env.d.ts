/// <reference types="vite/client" />

// Extiende las envs con tus variables personalizadas:
interface ImportMetaEnv {
  /**
   * Habilita las semillas de datos en desarrollo.
   * Usa string porque Vite expone envs como strings.
   */
  readonly VITE_ENABLE_SEED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
