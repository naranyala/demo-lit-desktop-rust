import './docs-layout';
import './utils/notifications';
import { Notifications } from './utils/notifications';
import { Theme } from './utils/theme';

window.addEventListener("DOMContentLoaded", () => {
  Notifications.init();
  Theme.init();
});
