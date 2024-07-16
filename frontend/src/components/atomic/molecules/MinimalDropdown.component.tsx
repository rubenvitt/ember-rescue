import { PiDotsThree } from 'react-icons/pi';
import { DropdownItemType, GenericDropdown } from './GenericDropdown.component.js';
import { useMemo } from 'react';

interface MinimalDotsDropdownProps {
  title: string;
  dropdownItems: DropdownItemType[];
  iconSize?: number;
}

export function MinimalDotsDropdown({ title, dropdownItems, iconSize = 20 }: MinimalDotsDropdownProps) {
  const buttonContent = useMemo(() => (
    <>
      <span className="sr-only">{title}</span>
      <PiDotsThree size={iconSize} aria-hidden="true" />
    </>
  ), [title, iconSize]);

  return (
    <GenericDropdown
      buttonContent={buttonContent}
      dropdownItems={dropdownItems}
      buttonClassName="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      menuClassName="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    />
  );
}