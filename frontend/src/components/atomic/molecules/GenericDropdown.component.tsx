import { ReactNode } from 'react';
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '../../deprecated/dropdown.js';
import { IconType } from 'react-icons';
import { Link } from '../../deprecated/link.js';

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

export type DropdownItemType = LinkDropdownItemType | ActionDropdownItemType;

interface GenericDropdownProps {
  buttonContent: ReactNode;
  dropdownItems: DropdownItemType[];
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  iconSize?: number;
}

export function GenericDropdown({
                                  buttonContent,
                                  dropdownItems,
                                  buttonClassName = 'flex items-center p-1.5 cursor-pointer',
                                  menuClassName = 'absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none',
                                  itemClassName = 'flex items-center w-full px-4 py-2 text-sm',
                                  iconSize = 16,
                                }: GenericDropdownProps) {
  return (
    <Dropdown>
      <DropdownButton className={buttonClassName} plain>
        {buttonContent}
      </DropdownButton>
      <DropdownMenu className={menuClassName}>
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item.text}
            className={itemClassName}
          >
            {'to' in item ? (
              <Link to={item.to} className="flex items-center w-full">
                {renderItemContent(item, iconSize)}
              </Link>
            ) : (
              <button onClick={item.onClick} className="flex items-center w-full">
                {renderItemContent(item, iconSize)}
              </button>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

function renderItemContent(item: DropdownItemType, iconSize: number) {
  return (
    <>
      {item.icon && <item.icon size={iconSize} className="mr-2" aria-hidden="true" />}
      <DropdownLabel>{item.text}</DropdownLabel>
    </>
  );
}