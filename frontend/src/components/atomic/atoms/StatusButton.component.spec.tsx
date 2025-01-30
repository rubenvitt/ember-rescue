import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusButtonComponent } from './StatusButton.component.tsx';
import { StatusDto } from '@bluelight-hub/shared/client/index.ts';

describe('StatusButtonComponent', () => {
  const mockOnClick = vi.fn();

  const statusItems: StatusDto[] = [
    { id: '1', code: 1, description: 'b-1', label: 'Einsatzbereit auf Funk' },
    { id: '2', code: 2, description: 'b-2', label: 'Einsatzbereit auf Wache / Standort' },
    { id: '3', code: 3, description: 'b-3', label: 'Einsatzübernahme (ausgerückt)' },
    { id: '4', code: 4, description: 'b-4', label: 'Einsatzort (vor Ort)' },
    { id: '5', code: 5, description: 'b-5', label: 'Sprechwunsch' },
    { id: '6', code: 6, description: 'b-6', label: 'Nicht einsatzbereit / außer Dienst' },
    { id: '7', code: 7, description: 'b-7', label: 'Einsatzgebunden' },
    { id: '8', code: 8, description: 'b-8', label: 'Bedingt verfügbar / am Zielort' },
    { id: '9', code: 9, description: 'b-9', label: 'Quittung / Datenabfrage (nur besondere Fahrzeuge)' },
    { id: '0', code: 0, description: 'b-0', label: 'Priorisierter Sprechwunsch' },
  ];

  statusItems.forEach((item) => {
    it(`renders correctly with status code ${item.code} and description ${item.description}`, () => {
      const { getByText } = render(
        <StatusButtonComponent onClick={mockOnClick} item={item} className="custom-class" />,
      );

      expect(getByText(`${item.code}`)).toBeInTheDocument();
      expect(getByText(`${item.code}`)).toHaveClass('font-bold text-xl');
      expect(getByText(`${item.description}`)).toBeInTheDocument();
      expect(getByText(`${item.description}`)).toHaveClass('font-light text-xs');
    });
  });

  it('triggers the onClick handler when clicked', () => {
    const status: StatusDto = {
      id: '2',
      code: 2,
      description: 'beschreibung-2',
      label: 'Einsatzbereit auf Wache / Standort',
    };
    const { getByText } = render(
      <StatusButtonComponent onClick={mockOnClick} item={status} className="custom-class" />,
    );

    fireEvent.click(getByText(`${status.code}`));
    expect(mockOnClick).toHaveBeenCalledWith({ statusId: status.id });
  });

  it('applies the correct class for status code 3', () => {
    const status: StatusDto = {
      id: '3',
      code: 3,
      description: 'beschreibung-3',
      label: 'Einsatzübernahme (ausgerückt)',
    };
    const { container } = render(
      <StatusButtonComponent onClick={mockOnClick} item={status} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass(
      'bg-yellow-200/30 text-yellow-900 ring-yellow-500 dark:bg-yellow-800/30 dark:text-yellow-100 hover:bg-yellow-500/30',
    );
  });

  it('merges the provided custom class with statusLabel classes', () => {
    const status: StatusDto = { id: '5', code: 5, description: 'beschreibung-5', label: 'Sprechwunsch' };
    const { container } = render(
      <StatusButtonComponent onClick={mockOnClick} item={status} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass(
      'bg-purple-200/30 text-purple-900 ring-purple-500 dark:bg-purple-800/30 dark:text-purple-100 hover:bg-purple-500/30',
    );
  });
});
