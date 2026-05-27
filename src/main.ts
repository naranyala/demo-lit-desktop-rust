import './docs-layout';
import './utils/notifications';
import { Notifications } from './utils/notifications';

window.addEventListener("DOMContentLoaded", () => {
  Notifications.init();
});
