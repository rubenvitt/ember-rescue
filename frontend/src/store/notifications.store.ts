import { create } from 'zustand';

export interface Notification {
  id: string;
  read?: Date;
  title: string;
  content: string;
  type: 'warning' | 'error' | 'info' | 'success';
  timestamp: Date;
}

interface AddNotificationConfig {
  asPush: boolean;
}

interface NotificationsStore {
  notificationCenter: {
    unreadCount: number;
    items: Notification[];
  };

  pushNotifications: {
    items: Notification[];
    clearPushNotifications(): void;
  };

  clearNotification(id: string): void;

  pushToNotifications(notification: Notification, config: AddNotificationConfig): void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notificationCenter: {
    items: [],
    unreadCount: 0,
  },
  pushNotifications: {
    items: [],
    clearPushNotifications() {
      set((state) => ({
        pushNotifications: {
          items: [],
          clearPushNotifications: state.pushNotifications.clearPushNotifications,
        },
      }));
    },
  },
  clearNotification(id: string) {
    set((state) => ({
      notificationCenter: {
        ...state.notificationCenter,
        items: state.notificationCenter.items.filter((item) => item.id !== id),
        unreadCount: state.notificationCenter.unreadCount - 1,
      },
    }));
  },
  pushToNotifications(notification: Notification, config: AddNotificationConfig) {
    set((state) => ({
      notificationCenter: {
        ...state.notificationCenter,
        items: [...state.notificationCenter.items, notification],
      },
      pushNotifications: {
        ...state.pushNotifications,
        items: config.asPush ? [...state.pushNotifications.items, notification] : state.pushNotifications.items,
      },
    }));
  },
}));
