import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A controller that synchronizes a value with browser storage.
 */
export class StorageController<T> implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _key: string;
  private _storage: Storage;
  private _value: T;

  constructor(host: ReactiveControllerHost, key: string, defaultValue: T, storage: Storage = localStorage) {
    this._host = host;
    this._key = key;
    this._storage = storage;
    
    const saved = this._storage.getItem(key);
    this._value = saved ? JSON.parse(saved) : defaultValue;
    
    host.addController(this);
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this._storage.setItem(this._key, JSON.stringify(newValue));
    this._host.requestUpdate();
  }

  // Useful for syncing across tabs/windows
  hostConnected() {
    window.addEventListener('storage', this._onStorageChange);
  }

  hostDisconnected() {
    window.removeEventListener('storage', this._onStorageChange);
  }

  private _onStorageChange = (e: StorageEvent) => {
    if (e.key === this._key) {
      this._value = e.newValue ? JSON.parse(e.newValue) : null;
      this._host.requestUpdate();
    }
  };
}

/**
 * A controller that tracks if the host element is intersecting with the viewport.
 */
export class IntersectionController implements ReactiveController {
  private _host: ReactiveControllerHost & { renderRoot: ShadowRoot | HTMLElement };
  private _observer: IntersectionObserver | null = null;
  private _options: IntersectionObserverInit;
  public isVisible = false;

  constructor(host: ReactiveControllerHost & { renderRoot: ShadowRoot | HTMLElement }, options: IntersectionObserverInit = { threshold: 0.1 }) {
    this._host = host;
    this._options = options;
    host.addController(this);
  }

  hostConnected() {
    this._observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting !== this.isVisible) {
        this.isVisible = entry.isIntersecting;
        this._host.requestUpdate();
      }
    }, this._options);

    this._observer.observe(this._host as unknown as HTMLElement);
  }

  hostDisconnected() {
    this._observer?.disconnect();
    this._observer = null;
  }
}
