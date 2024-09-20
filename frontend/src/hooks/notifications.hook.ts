import { useNotificationsStore } from '../store/notifications.store.js';

export const useNotifications = () => {
  const { notificationCenter, pushToNotifications, clearNotification, pushNotifications } = useNotificationsStore();

  return { notificationCenter, pushToNotifications, clearNotification, pushNotifications };
};
