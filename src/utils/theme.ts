import { StorageService } from './storage';

export type ThemeMode = 'light' | 'dark' | 'system';

class ThemeProvider {
  private _mode: ThemeMode = this._loadMode();

  private _loadMode(): ThemeMode {
    return StorageService.get<ThemeMode>('app-theme') || 'system';
  }

  get mode(): ThemeMode {
    return this._mode;
  }

  set mode(newMode: ThemeMode) {
    this._mode = newMode;
    StorageService.set('app-theme', newMode);
    this.applyTheme();
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newMode }));
  }

  applyTheme() {
    const root = window.document.documentElement;
    const isDark = this._mode === 'dark' || 
                   (this._mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Listen for system theme changes when in 'system' mode
  init() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this._mode === 'system') {
          this.applyTheme();
          window.dispatchEvent(new CustomEvent('theme-changed', { detail: this._mode }));
        }
      });
    this.applyTheme();
  }
}

export const Theme = new ThemeProvider();
