import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

export interface NotificationOptions {
  duration?: number;
}

@customElement('app-notifications')
export class AppNotifications extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .notification {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      padding: 1rem;
      border-radius: 8px;
      color: white;
      font-family: sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out forwards;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .notification.success { background-color: #28a745; }
    .notification.error { background-color: #dc3545; }
    .notification.info { background-color: #17a2b8; }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.2rem;
      margin-left: 1rem;
      opacity: 0.7;
    }
    .close-btn:hover { opacity: 1; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;

  @state()
  private _notifications: { id: number, type: string, message: string }[] = [];
  private _counter = 0;

  public notify(type: 'success' | 'error' | 'info', message: string, options?: NotificationOptions) {
    const id = this._counter++;
    this._notifications = [...this._notifications, { id, type, message }];

    if (options?.duration === undefined || options?.duration > 0) {
      setTimeout(() => this.dismiss(id), options?.duration ?? 5000);
    }
  }

  public dismiss(id: number) {
    this._notifications = this._notifications.filter(n => n.id !== id);
  }

  render() {
    return html`
      ${this._notifications.map(n => html`
        <div class="notification ${n.type}">
          <span>${n.message}</span>
          <button class="close-btn" @click="${() => this.dismiss(n.id)}">&times;</button>
        </div>
      `)}
    `;
  }
}

// Singleton access
let notificationsElement: AppNotifications | null = null;

export const Notifications = {
  init() {
    const el = document.querySelector('app-notifications') as unknown as AppNotifications;
    if (el) notificationsElement = el;
  },
  success(msg: string, opts?: NotificationOptions) {
    notificationsElement?.notify('success', msg, opts);
  },
  error(msg: string, opts?: NotificationOptions) {
    notificationsElement?.notify('error', msg, opts);
  },
  info(msg: string, opts?: NotificationOptions) {
    notificationsElement?.notify('info', msg, opts);
  }
};
