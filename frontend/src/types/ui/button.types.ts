import { ComponentPropsWithoutRef, ComponentType, ReactNode, SVGProps } from 'react';
import * as Headless from '@headlessui/react';
import { VariantProps } from 'class-variance-authority';
import { Link } from '../../components/atomic/atoms/Link.js';
import { buttonVariants } from '../../styles/button.styles.ts';

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
}
  & (
  | Omit<Headless.ButtonProps, 'className'>
  | Omit<ComponentPropsWithoutRef<typeof Link>, 'className'>
  )
  & (
  | { icon: never, iconPosition: never, iconSize: never, children: ReactNode; }
  | {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
})
  & (
  | { href?: never, onclick?: never, type: 'submit' }
  | { href: string; onClick?: never; }
  | { href?: never; onClick: () => unknown | Promise<unknown>; }
  );