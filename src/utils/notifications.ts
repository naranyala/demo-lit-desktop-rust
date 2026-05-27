import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

export interface NotificationOptions { duration?: number; }

@customElement('app-notifications')
export class AppNotifications extends LitElement {
  static override styles = css`
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
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .notification-anim {
      animation: slideIn 0.3s ease-out forwards;
    }
  `;

  @state() private _notifications: { id: number, type: string, message: string }[] = [];
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

  override   render() {
    return html`
      ${this._notifications.map(n => {
        const typeClasses: Record<string, string> = {
          success: 'bg-green-600',
          error: 'bg-red-600',
          info: 'bg-cyan-600',
        };
        return html`
          <div class="notification-anim pointer-events-auto min-w-[300px] max-w-[450px] p-4 rounded-lg text-white font-sans shadow-lg flex justify-between items-center ${typeClasses[n.type]}">
            <span>${n.message}</span>
            <button 
              class="bg-none border-none text-white cursor-pointer text-xl ml-4 opacity-70 hover:opacity-100" 
              @click="${() => this.dismiss(n.id)}"
            >&times;</button>
          </div>
        `;
      })}
    `;
  }
}

let notificationsElement: AppNotifications | null = null;

export const Notifications = {
  init() {
    const el = document.querySelector('app-notifications') as unknown as AppNotifications;
    if (el) notificationsElement = el;
  },
  success(msg: string, opts?: NotificationOptions) { notificationsElement?.notify('success', msg, opts); },
  error(msg: string, opts?: NotificationOptions) { notificationsElement?.notify('error', msg, opts); },
  info(msg: string, opts?: NotificationOptions) { notificationsElement?.notify('info', msg, opts); }
};

