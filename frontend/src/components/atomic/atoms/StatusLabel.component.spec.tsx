// StatusLabel.component.test.tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusLabel } from './StatusLabel.component.js';
import { SmallStatusDto } from '../../../types/app/status.types.js';

describe('StatusLabel', () => {
  const statuses: SmallStatusDto[] = [
    { id: '1', code: 1, bezeichnung: 'Einsatzbereit auf Funk' },
    { id: '2', code: 2, bezeichnung: 'Einsatzbereit auf Wache / Standort' },
    { id: '3', code: 3, bezeichnung: 'Einsatzübernahme (ausgerückt)' },
    { id: '4', code: 4, bezeichnung: 'Einsatzort (vor Ort)' },
    { id: '5', code: 5, bezeichnung: 'Sprechwunsch' },
    { id: '6', code: 6, bezeichnung: 'Nicht einsatzbereit / außer Dienst' },
    { id: '7', code: 7, bezeichnung: 'Einsatzgebunden' },
    { id: '8', code: 8, bezeichnung: 'Bedingt verfügbar / am Zielort' },
    { id: '9', code: 9, bezeichnung: 'Quittung / Datenabfrage (nur besondere Fahrzeuge)' },
    { id: '0', code: 0, bezeichnung: 'Priorisierter Sprechwunsch' },
  ];

  const statusColors: Record<number, string> = {
    1: 'green-900',
    2: 'blue-900',
    3: 'yellow-900',
    4: 'orange-900',
    5: 'purple-900',
    6: 'gray-900',
    7: 'indigo-900',
    8: 'teal-900',
    9: 'pink-900',
    0: 'rose-900',
  };

  statuses.forEach((status) => {
    it(`renders correctly with status code ${status.code} and bezeichnung ${status.bezeichnung}`, () => {
      const { getByText } = render(<StatusLabel status={status} />);
      const statusText = getByText(`${status.code} (${status.bezeichnung})`);

      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset');
      expect(statusText).toHaveClass(`text-${statusColors[status.code as number]}`);
    });
  });

  it('applies the correct class for status code 1', () => {
    const status: SmallStatusDto = { id: '1', code: 1, bezeichnung: 'Einsatzbereit auf Funk' };
    const { container } = render(<StatusLabel status={status} />);
    const statusElement = container.firstChild;

    expect(statusElement).toHaveClass(
      'bg-green-200/30 text-green-900 ring-green-500 dark:bg-green-800/30 dark:text-green-100 hover:bg-green-500/30',
    );
  });

  it('renders with default status code if none provided', () => {
    const status: SmallStatusDto = { id: 'default', code: 3, bezeichnung: 'Standardstatus' };
    const { container, getByText } = render(<StatusLabel status={status} />);
    const statusElement = getByText(`3 (Standardstatus)`);

    expect(statusElement).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      'bg-yellow-200/30 text-yellow-900 ring-yellow-500 dark:bg-yellow-800/30 dark:text-yellow-100 hover:bg-yellow-500/30',
    );
  });
});
