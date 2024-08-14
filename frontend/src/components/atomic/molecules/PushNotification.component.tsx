'use client';

import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Notification } from '../../../store/notifications.store.js';

interface PushNotificationProps {
  notification?: Notification;
}

export function PushNotification({ notification }: PushNotificationProps) {
  const [show, setShow] = useState(true);

  return (
    <Transition show={show}>
      <div
        className="pointer-events-auto flex w-full max-w-md divide-x divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
        <div className="flex w-0 flex-1 items-center p-4">
          <div className="w-full">
            <p className="text-sm font-medium text-gray-900">{notification?.title} ({notification?.id})</p>
            <p className="mt-1 text-sm text-gray-500">{notification?.content}</p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col divide-y divide-gray-200">
            <div className="flex h-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  setShow(false);
                }}
                className="flex w-full items-center justify-center rounded-none rounded-tr-lg border border-transparent px-4 py-3 text-sm font-medium text-primary-600 hover:text-primary-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Reply
              </button>
            </div>
            <div className="flex h-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  setShow(false);
                }}
                className="flex w-full items-center justify-center rounded-none rounded-br-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Don't allow
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
