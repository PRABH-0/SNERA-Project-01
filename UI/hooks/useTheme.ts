"use client";

 
import { useCallback, useEffect, useState } from 'react';
export type Theme = 'light' | 'dark' | 'system';

export function useTheme(initial: Theme = 'system') {
  const getInit = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    try {
      const s = localStorage.getItem('theme') as Theme | null;
      return s || 'system';
    } catch { return 'system'; }
  };
  const [theme, setThemeState] = useState<Theme>(getInit);

  const apply = useCallback((t: Theme) => {
    const root = document.documentElement;
    let mode: 'light'|'dark' = 'light';
    if (t === 'system') mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    else mode = t;

    root.classList.remove('light-mode','dark-mode');
    root.classList.add(mode === 'dark' ? 'dark-mode' : 'light-mode');

    if (mode === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    root.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    apply(theme);
    try {
      if (theme === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', theme);
    } catch {}
  }, [theme, apply]);

  useEffect(() => {
    if (theme !== 'system') return;
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const h = () => apply('system');
    m.addEventListener ? m.addEventListener('change', h) : m.addListener(h);
    return () => m.removeEventListener ? m.removeEventListener('change', h) : m.removeListener(h);
  }, [theme, apply]);

  return {
    theme,
    setTheme: setThemeState,
    toggle: () => setThemeState(prev => (prev === 'dark' ? 'light' : 'dark')),
    setSystem: () => setThemeState('system')
  };
}
