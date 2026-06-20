/// <reference types="astro/client" />

import type { ThemeMode } from "./lib/theme";

declare global {
  interface Window {
    __theme?: {
      getMode: () => ThemeMode;
      setMode: (mode: ThemeMode) => void;
      cycle: () => void;
    };
  }
}

export {};
