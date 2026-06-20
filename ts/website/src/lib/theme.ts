export type ThemeMode = "light" | "dark" | "system";

/**
 * Source of the inline, render-blocking script injected into <head>. It runs
 * before first paint to set `data-theme` (resolved light/dark) and `data-mode`
 * (the chosen mode) on <html>, preventing any flash of the wrong theme. It also
 * exposes `window.__theme` for the toggle and keeps `system` mode reactive to
 * OS theme changes.
 */
export const themeScript = `(() => {
  const KEY = "theme-mode";
  const system = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const getMode = () => {
    const m = localStorage.getItem(KEY);
    return m === "light" || m === "dark" || m === "system" ? m : "system";
  };
  const resolve = (mode) => (mode === "system" ? system() : mode);
  const apply = (mode) => {
    const root = document.documentElement;
    root.dataset.theme = resolve(mode);
    root.dataset.mode = mode;
  };
  const setMode = (mode) => {
    localStorage.setItem(KEY, mode);
    apply(mode);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { mode } }));
  };
  const cycle = () => {
    const order = ["system", "light", "dark"];
    setMode(order[(order.indexOf(getMode()) + 1) % order.length]);
  };
  apply(getMode());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getMode() === "system") apply("system");
    });
  window.__theme = { getMode, setMode, cycle };
})();`;
