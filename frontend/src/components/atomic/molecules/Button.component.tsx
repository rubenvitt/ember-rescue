import { ForwardedRef, forwardRef } from 'react';
import { ButtonProps } from '../../../types/button.types.ts';
import { buttonVariants } from '../../../styles/button.styles.ts';
import { Link } from '../../deprecated/link.js';
import { TouchTarget } from '../atoms/TouchTarget.component.js';
import * as Headless from '@headlessui/react';

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { intent, color, className, children, ...props },
  ref,
) {
  const buttonClasses = buttonVariants({ intent, color, className });

  if ('href' in props) {
    return (
      <Link {...props} className={buttonClasses} ref={ref as ForwardedRef<HTMLAnchorElement>}>
        <TouchTarget>{children}</TouchTarget>
      </Link>
    );
  }

  return (
    <Headless.Button {...props} className={buttonClasses} ref={ref}>
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  );
});