/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
