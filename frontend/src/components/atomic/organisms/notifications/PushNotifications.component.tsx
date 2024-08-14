import { useNotifications } from '../../../../hooks/notifications.hook.js';
import { useEffect } from 'react';
import { PushNotification } from '../../molecules/PushNotification.component.js';
import { toast } from 'react-toastify';
import { PiWrench } from 'react-icons/pi';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';

export function PushNotifications() {
  const {
    pushToNotifications,
    pushNotifications: { clearPushNotifications, items },
    clearNotification,
  } = useNotifications();
  const {markAsRead} = useNotificationCenter()

  useEffect(() => {
    setTimeout(() => {
      toast('Juhu, ein Toast', {
        icon: PiWrench,
        toastId: 'manual',
        type: 'success',
        autoClose: false,
      });
    }, 2000);
  }, []);

  return <div
    aria-live="assertive"
    className="pointer-events-none z-50 fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
      {items.map((pushNotification) => (
        <PushNotification key={pushNotification.id} notification={pushNotification} />
      ))}
    </div>
  </div>
    ;
}