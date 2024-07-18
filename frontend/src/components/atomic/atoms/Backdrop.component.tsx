import * as Headless from '@headlessui/react';

export function DialogBackdrop() {
  return <Headless.DialogBackdrop
    className="fixed inset-0 bg-gray-500 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
  />;
}