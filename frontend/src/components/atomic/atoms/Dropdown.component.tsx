import React from 'react';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Link } from '@tanstack/react-router';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface BaseDropdownItemType {
  icon?: IconType;
  text: string;
}

interface LinkDropdownItemType extends BaseDropdownItemType {
  to: string;
  onClick?: never;
}

interface ActionDropdownItemType extends BaseDropdownItemType {
  onClick: () => void;
  to?: never;
}

type DropdownItemType = LinkDropdownItemType | ActionDropdownItemType;

interface DropdownItemProps {
  item: DropdownItemType;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ item }) => {
  const { icon: Icon, text } = item;
  const commonClasses = 'group flex w-full items-center px-4 py-2 text-sm';

  const content = (
    <>
      {Icon && <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />}
      {text}
    </>
  );

  return (
    <Menu.Item>
      {({ active }) =>
        'to' in item ? (
          <Link
            to={item.to}
            className={clsx(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              commonClasses,
            )}
          >
            {content}
          </Link>
        ) : (
          <button
            onClick={item.onClick}
            className={clsx(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              commonClasses,
            )}
          >
            {content}
          </button>
        )
      }
    </Menu.Item>
  );
};

interface DropdownProps {
  buttonText: string;
  icon?: IconType;
  items: DropdownItemType[][];
  minimal?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ buttonText, icon: ButtonIcon, items, minimal = false }) => {
  return (
    <Menu as="div" className="relative flex-none">
      <Menu.Button
        className={clsx(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          minimal
            ? 'flex p-1.5 text-gray-500 hover:text-gray-900'
            : 'bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
        )}
      >
        {minimal ? (
          <>
            <span className="sr-only">{buttonText}</span>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </>
        ) : (
          <>
            {buttonText}
            {ButtonIcon && <ButtonIcon className="-mr-1 ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />}
          </>
        )}
      </Menu.Button>

      <Menu.Items
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {items.map((section, sectionIndex) => (
          <div key={sectionIndex} className="py-1">
            {section.map((item, itemIndex) => (
              <DropdownItem
                key={itemIndex}
                item={item}
              />
            ))}
          </div>
        ))}
      </Menu.Items>
    </Menu>
  );
};