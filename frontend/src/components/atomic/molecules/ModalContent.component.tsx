import React from 'react';

interface ModalContentProps {
  content: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const ModalContent: React.FC<ModalContentProps> = ({ content, icon: Icon }) => (
  <div className="sm:flex sm:items-start">
    {Icon && (
      <div
        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <Icon className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
    )}
    <div className="text-center sm:text-left flex-1">
      <div className="mt-2">
        <div className="text-sm text-gray-500">{content}</div>
      </div>
    </div>
  </div>
);