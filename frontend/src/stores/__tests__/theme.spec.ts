import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useThemeStore } from '@/stores/theme';

global.fetch = vi.fn();

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const store = useThemeStore();

    expect(store.themeConfig).toBeNull();
    expect(store.isDark).toBe(false);
    expect(store.isLoading).toBe(true);
  });

  it('should load theme configuration', async () => {
    const mockTheme = {
      name: 'Test Theme',
      version: '1.0.0',
      logo: {
        light: '/logo-light.svg',
        dark: '/logo-dark.svg',
        favicon: '/favicon.ico'
      },
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test App' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.themeConfig).toEqual(mockTheme);
    expect(store.isLoading).toBe(false);
  });

  it('should toggle theme mode', async () => {
    const mockTheme = {
      name: 'Test Theme',
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.isDark).toBe(false);
    expect(store.currentMode).toBe('light');

    store.toggleTheme();

    expect(store.isDark).toBe(true);
    expect(store.currentMode).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('should restore saved theme preference', async () => {
    localStorage.setItem('app-theme', 'dark');

    const mockTheme = {
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.isDark).toBe(true);
    expect(store.currentMode).toBe('dark');
  });

  it('should return current logo based on theme', async () => {
    const mockTheme = {
      logo: {
        light: '/logo-light.svg',
        dark: '/logo-dark.svg',
        favicon: '/favicon.ico'
      },
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.currentLogo).toBe('/logo-light.svg');

    store.toggleTheme();

    expect(store.currentLogo).toBe('/logo-dark.svg');
  });

  it('should return current colors based on theme', async () => {
    const mockTheme = {
      colors: {
        light: { primary: '#1867C0', secondary: '#5CBBF6' },
        dark: { primary: '#2196F3', secondary: '#424242' }
      },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.currentColors).toEqual({
      primary: '#1867C0',
      secondary: '#5CBBF6'
    });

    store.toggleTheme();

    expect(store.currentColors).toEqual({
      primary: '#2196F3',
      secondary: '#424242'
    });
  });

  it('should update theme colors programmatically', async () => {
    const mockTheme = {
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    store.updateThemeColors({ primary: '#FF0000' });

    expect(store.currentColors.primary).toBe('#FF0000');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.themeConfig).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should set specific theme mode', async () => {
    const mockTheme = {
      colors: {
        light: { primary: '#1867C0' },
        dark: { primary: '#2196F3' }
      },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'Test' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    store.setTheme('dark');
    expect(store.isDark).toBe(true);
    expect(localStorage.getItem('app-theme')).toBe('dark');

    store.setTheme('light');
    expect(store.isDark).toBe(false);
    expect(localStorage.getItem('app-theme')).toBe('light');
  });

  it('should return app name from configuration', async () => {
    const mockTheme = {
      colors: { light: {}, dark: {} },
      logo: { light: '/light.svg', dark: '/dark.svg' },
      fonts: { primary: 'Roboto' },
      customization: { appName: 'My Custom App' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTheme
    });

    const store = useThemeStore();
    await store.loadTheme();

    expect(store.appName).toBe('My Custom App');
  });
});
