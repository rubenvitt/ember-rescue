import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FormSectionHeading } from './FormSectionHeading.component.js';

interface Props {
  heading: React.ReactNode;
  subHeading?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  classNameContainer?: {
    heading?: string;
    content?: string;
  };
}

export function FormSection({ heading, subHeading, children, classNameContainer, className }: Props) {
  return (
    <section className={twMerge('grid gap-4 md:grid-cols-3', className)}>
      <FormSectionHeading heading={heading} subHeading={subHeading} />
      <div className={twMerge('col-span-2', classNameContainer?.content)}>{children}</div>
    </section>
  );
}
