import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * A generic controller for managing event listeners on any target.
 * Ensures listeners are cleaned up when the host component is disconnected.
 */
export class EventListenerController implements ReactiveController {
  private _listeners: { target: EventTarget; type: string; handler: EventListener }[] = [];

  constructor(host: ReactiveControllerHost) {
    host.addController(this);
  }

  add(target: EventTarget, type: string, handler: EventListener) {
    target.addEventListener(type, handler);
    this._listeners.push({ target, type, handler });
  }

  remove(target: EventTarget, type: string, handler: EventListener) {
    target.removeEventListener(type, handler);
    this._listeners = this._listeners.filter(l => 
      !(l.target === target && l.type === type && l.handler === handler)
    );
  }

  hostDisconnected() {
    for (const { target, type, handler } of this._listeners) {
      target.removeEventListener(type, handler);
    }
    this._listeners = [];
  }
}

/**
 * A controller that provides reactive browser window dimensions.
 */
export class WindowSizeController implements ReactiveController {
  private _host: ReactiveControllerHost;
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  private _onResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this._host.requestUpdate();
  };

  hostConnected() {
    window.addEventListener('resize', this._onResize);
  }

  hostDisconnected() {
    window.removeEventListener('resize', this._onResize);
  }
}
