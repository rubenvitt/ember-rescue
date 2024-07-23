import { ForwardedRef, forwardRef, useMemo } from 'react';
import { ButtonProps } from '../../../types/button.types.ts';
import { buttonVariants } from '../../../styles/button.styles.ts';
import { Link } from '../../deprecated/link.js';
import { TouchTarget } from '../atoms/TouchTarget.component.js';
import * as Headless from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { intent, color, className, children, icon: Icon, iconPosition = 'left', iconSize = 'md', ...props },
  ref,
) {
  const isIconOnly = useMemo(() => {
    return Icon && !children;
  }, [Icon, children]);

  const actualIntent = useMemo(() => {
    return intent || isIconOnly ? 'plain' : 'solid';
  }, [isIconOnly, intent]);

  const buttonClasses = twMerge(buttonVariants({ intent: actualIntent, color }), isIconOnly && 'p-2', className);


  const iconSizeClasses = useMemo(() => {
    switch (iconSize) {
      case 'xs':
        return 'h-3 w-3';
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-5 w-5';
      case 'lg':
        return 'h-6 w-6';
      case 'xl':
        return 'h-8 w-8';
      default:
        return 'h-5 w-5'; // Default to medium if size is unrecognized
    }
  }, [iconSize]);

  const content = useMemo(() => {
    return <>
      {Icon && iconPosition === 'left' && <Icon className={iconSizeClasses} aria-hidden="true" />}
      {children && children}
      {Icon && iconPosition === 'right' && <Icon className={iconSizeClasses} aria-hidden="true" />}
    </>;
  }, [Icon, iconPosition, children]);

  if ('href' in props) {
    return (
      <Link {...props} className={buttonClasses} ref={ref as ForwardedRef<HTMLAnchorElement>}>
        <TouchTarget>{content}</TouchTarget>
      </Link>
    );
  }

  return (
    <Headless.Button {...props} className={buttonClasses} ref={ref}>
      <TouchTarget>{content}</TouchTarget>
    </Headless.Button>
  );
});