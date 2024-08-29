import React from 'react';
import { MobileSidebarProps } from '../../../../types/ui/nav.types.js';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/outline/index.js';
import { SidebarContentComponent } from './SidebarContent.component.js';

export const MobileSidebarComponent: React.FC<MobileSidebarProps> = ({
                                                                       sidebarOpen,
                                                                       setSidebarOpen,
                                                                     }) => (
  <Dialog className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
    <DialogBackdrop
      transition
      className={twMerge(
        'fixed inset-0 bg-gray-900/80 transition-opacity duration-100 ease-linear',
        !sidebarOpen && 'opacity-0',
      )}
    />
    <div className="fixed inset-0 flex">
      <DialogPanel
        transition
        className={twMerge(
          'relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-100 ease-in-out',
          !sidebarOpen && '-translate-x-full',
        )}
      >
        <TransitionChild>
          <div className={twMerge(
            'absolute left-full top-0 flex w-16 justify-center pt-5 duration-100 ease-in-out',
            !sidebarOpen && 'opacity-0',
          )}>
            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
              <span className="sr-only">Sidebar schließen</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </TransitionChild>
        <SidebarContentComponent />
      </DialogPanel>
    </div>
  </Dialog>
);