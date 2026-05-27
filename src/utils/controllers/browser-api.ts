import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Tracks the online/offline status of the browser.
 */
export class NetworkController implements ReactiveController {
  private _host: ReactiveControllerHost;
  public online: boolean = navigator.onLine;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  private _updateStatus = () => {
    this.online = navigator.onLine;
    this._host.requestUpdate();
  };

  hostConnected() {
    window.addEventListener('online', this._updateStatus);
    window.addEventListener('offline', this._updateStatus);
  }

  hostDisconnected() {
    window.removeEventListener('online', this._updateStatus);
    window.removeEventListener('offline', this._updateStatus);
  }
}

/**
 * Tracks whether the browser tab/window is focused or blurred.
 */
export class FocusController implements ReactiveController {
  private _host: ReactiveControllerHost;
  public isFocused: boolean = document.hasFocus();

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  private _onFocusChange = () => {
    this.isFocused = document.hasFocus();
    this._host.requestUpdate();
  };

  hostConnected() {
    window.addEventListener('focus', this._onFocusChange);
    window.addEventListener('blur', this._onFocusChange);
  }

  hostDisconnected() {
    window.removeEventListener('focus', this._onFocusChange);
    window.removeEventListener('blur', this._onFocusChange);
  }
}

/**
 * Syncs component state with URL search parameters.
 */
export class UrlParamsController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _params = new URLSearchParams(window.location.search);

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  // Get a parameter value
  get(key: string): string | null {
    return this._params.get(key);
  }

  // Set a parameter and update the URL without reloading the page
  set(key: string, value: string) {
    this._params.set(key, value);
    const newUrl = `${window.location.pathname}?${this._params.toString()}`;
    window.history.pushState({}, '', newUrl);
    this._host.requestUpdate();
  }

  remove(key: string) {
    this._params.delete(key);
    const newUrl = `${window.location.pathname}?${this._params.toString()}`;
    window.history.pushState({}, '', newUrl);
    this._host.requestUpdate();
  }

  hostConnected() {
    window.addEventListener('popstate', this._onPopState);
  }

  hostDisconnected() {
    window.removeEventListener('popstate', this._onPopState);
  }

  private _onPopState = () => {
    this._params = new URLSearchParams(window.location.search);
    this._host.requestUpdate();
  };
}

/**
 * Tracks the system's preferred color scheme (dark/light).
 */
export class ThemeController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _query = window.matchMedia('(prefers-color-scheme: dark)');
  public isDarkMode: boolean = this._query.matches;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  private _onThemeChange = () => {
    this.isDarkMode = this._query.matches;
    this._host.requestUpdate();
  };

  hostConnected() {
    this._query.addEventListener('change', this._onThemeChange);
  }

  hostDisconnected() {
    this._query.removeEventListener('change', this._onThemeChange);
  }
}
