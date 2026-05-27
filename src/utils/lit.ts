import type { ReactiveController, ReactiveControllerHost } from 'lit';

export function dispatch<D = void>(
  host: EventTarget,
  type: string,
  detail?: D,
  options: Omit<CustomEventInit<D>, 'detail'> = {}
): void {
  host.dispatchEvent(
    new CustomEvent<D>(type, { bubbles: true, composed: true, ...options, detail })
  );
}

export class EventController implements ReactiveController {
  private _target: EventTarget;
  private _type: string;
  private _handler: EventListenerOrEventListenerObject;
  private _options?: AddEventListenerOptions;

  constructor(
    host: ReactiveControllerHost,
    target: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ) {
    this._target = target;
    this._type = type;
    this._handler = handler;
    this._options = options;
    host.addController(this);
  }

  hostConnected(): void {
    this._target.addEventListener(this._type, this._handler, this._options);
  }

  hostDisconnected(): void {
    this._target.removeEventListener(this._type, this._handler, this._options);
  }
}

export class DebounceController implements ReactiveController {
  private _fn: (...args: any[]) => void;
  private _delay: number;
  private _timer: ReturnType<typeof setTimeout> | null = null;

  constructor(host: ReactiveControllerHost, fn: (...args: any[]) => void, delay: number) {
    this._fn = fn;
    this._delay = delay;
    host.addController(this);
  }

  get delay(): number { return this._delay; }
  set delay(v: number) { this._delay = v; }

  run(...args: any[]): void {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._timer = null;
      this._fn(...args);
    }, this._delay);
  }

  cancel(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  flush(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
      this._fn();
    }
  }

  hostDisconnected(): void {
    this.cancel();
  }
}

export type KeyMap = Record<string, (e: KeyboardEvent) => void>;

export class KeyboardController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _keyMap: KeyMap;
  private _handler: EventListener;

  constructor(host: ReactiveControllerHost, keyMap: KeyMap) {
    this._host = host;
    this._keyMap = keyMap;
    this._handler = ((e: Event) => {
      const action = this._keyMap[(e as KeyboardEvent).key];
      action?.(e as KeyboardEvent);
    }) as EventListener;
    host.addController(this);
  }

  hostConnected(): void {
    (this._host as unknown as EventTarget).addEventListener('keydown', this._handler);
  }

  hostDisconnected(): void {
    (this._host as unknown as EventTarget).removeEventListener('keydown', this._handler);
  }
}

export class MediaQueryController implements ReactiveController {
  private _mq: MediaQueryList;
  private _onChange: () => void;

  constructor(host: ReactiveControllerHost, query: string) {
    this._mq = window.matchMedia(query);
    this._onChange = () => host.requestUpdate();
    this._mq.addEventListener('change', this._onChange);
    host.addController(this);
  }

  get matches(): boolean {
    return this._mq.matches;
  }

  hostDisconnected(): void {
    this._mq.removeEventListener('change', this._onChange);
  }
}
