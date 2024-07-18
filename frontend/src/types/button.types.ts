import { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as Headless from '@headlessui/react';
import { VariantProps } from 'class-variance-authority';
import { Link } from '../components/deprecated/link.js';
import { buttonVariants } from '../styles/button.styles.ts';

export type ButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: ReactNode;
} & (
  | Omit<Headless.ButtonProps, 'className'>
  | Omit<ComponentPropsWithoutRef<typeof Link>, 'className'>
  );