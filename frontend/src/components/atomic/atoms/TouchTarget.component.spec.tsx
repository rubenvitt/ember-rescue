// TouchTarget.component.test.tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TouchTarget } from './TouchTarget.component.js';

describe('TouchTarget', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <TouchTarget>
        <div>Child Content</div>
      </TouchTarget>,
    );

    const childElement = getByText('Child Content');
    expect(childElement).toBeInTheDocument();
  });

  it('renders span with correct classes', () => {
    const { container } = render(
      <TouchTarget>
        <div>Child Content</div>
      </TouchTarget>,
    );

    const spanElement = container.querySelector('span');
    expect(spanElement).toHaveClass('absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden');
    expect(spanElement).toHaveAttribute('aria-hidden', 'true');
  });
});