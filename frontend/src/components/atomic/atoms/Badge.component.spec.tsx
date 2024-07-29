// Badge.component.test.tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './Badge.component.js';

describe('Badge Component', () => {
  const badgeColors = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
    'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'zinc',
  ];

  badgeColors.forEach(color => {
    it(`renders correctly with color ${color}`, () => {
      const { getByText } = render(<Badge color={color}>Badge</Badge>);
      const badgeElement = getByText('Badge');

      expect(badgeElement).toBeInTheDocument();
      expect(badgeElement).toHaveClass(`bg-${color}-500/15`);
    });
  });

  it('renders with default color when no color is specified', () => {
    const { getByText } = render(<Badge>Badge</Badge>);
    const badgeElement = getByText('Badge');

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-zinc-600/10');
  });

  it('merges provided classes with default classes', () => {
    const { getByText } = render(<Badge className="custom-class">Badge</Badge>);
    const badgeElement = getByText('Badge');

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('custom-class');
    expect(badgeElement).toHaveClass('bg-zinc-600/10');
  });
});