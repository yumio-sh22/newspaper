/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Разрешаем импорт CSS файлов
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}