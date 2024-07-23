import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { Link } from '../atoms/Link.js';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import { Button } from './Button.component.tsx';

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
      <DropdownButton className={buttonClassName} intent="plain">
        {buttonContent}
      </DropdownButton>
      <DropdownMenu className={menuClassName}>
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item.text}
            className={itemClassName}
            to={item.to}
            href={item.to}
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


///


function Dropdown(props: Headless.MenuProps) {
  return <Headless.Menu {...props} />;
}

function DropdownButton<T extends React.ElementType = typeof Button>({
                                                                       as = Button,
                                                                       ...props
                                                                     }: {
  className?: string
} & Omit<Headless.MenuButtonProps<T>, 'className'>) {
  return <Headless.MenuButton as={as} {...props} />;
}

function DropdownMenu({
                        anchor = 'bottom',
                        className,
                        ...props
                      }: { className?: string } & Omit<Headless.MenuItemsProps, 'className'>) {
  return (
    <Headless.MenuItems
      {...props}
      transition
      anchor={anchor}
      className={clsx(
        className,
        // Anchor positioning
        '[--anchor-gap:theme(spacing.2)] [--anchor-padding:theme(spacing.1)] data-[anchor~=start]:[--anchor-offset:-6px] data-[anchor~=end]:[--anchor-offset:6px] sm:data-[anchor~=start]:[--anchor-offset:-4px] sm:data-[anchor~=end]:[--anchor-offset:4px]',
        // Base styles
        'isolate w-max rounded-xl p-1',
        // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
        'outline outline-1 outline-transparent focus:outline-none',
        // Handle scrolling when menu won't fit in viewport
        'overflow-y-auto',
        // Popover background
        'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
        // Shadows
        'shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10',
        // Define grid at the menu level if subgrid is supported
        'supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
        // Transitions
        'transition data-[closed]:data-[leave]:opacity-0 data-[leave]:duration-100 data-[leave]:ease-in',
      )}
    />
  );
}

function DropdownItem({
                        className,
                        ...props
                      }: { className?: string, href?: string } & (
  | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  | Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>
  )) {
  let classes = clsx(
    className,
    // Base styles
    'group cursor-pointer rounded-lg px-3.5 py-2.5 focus:outline-none sm:px-3 sm:py-1.5',
    // Text styles
    'text-left text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
    // Focus
    'data-[focus]:bg-blue-500 data-[focus]:text-white',
    // Disabled state
    'data-[disabled]:opacity-50',
    // Forced colors mode
    'forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-[focus]:text-[HighlightText]',
    // Use subgrid when available but fallback to an explicit grid layout if not
    'col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid',
    // Icons
    '[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:sm:size-4',
    '[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:data-[focus]:text-white [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:data-[focus]:dark:text-white',
    // Avatar
    '[&>[data-slot=avatar]]:-ml-1 [&>[data-slot=avatar]]:mr-2.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:mr-2 sm:[&>[data-slot=avatar]]:size-5',
  );

  return (
    <Headless.MenuItem>
      {'href' in props ? (
        <Link {...props} className={classes} to={props.href} />
      ) : (
        // @ts-ignore
        <button type="button" {...props} className={classes} />
      )}
    </Headless.MenuItem>
  );
}

export function DropdownLabel({
                                className,
                                ...props
                              }: { className?: string } & Omit<Headless.LabelProps, 'className'>) {
  return (
    <Headless.Label {...props} data-slot="label" className={clsx(className, 'col-start-2 row-start-1')} {...props} />
  );
}
