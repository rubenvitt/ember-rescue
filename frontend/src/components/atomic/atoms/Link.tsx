import * as Headless from '@headlessui/react';
import { Link as RouterLink, LinkProps } from '@tanstack/react-router';
import React, { forwardRef } from 'react';

export const Link = forwardRef(function Link(
  props: LinkProps & { className?: string },
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} ref={ref} preload="intent" />
    </Headless.DataInteractive>
  );
});
