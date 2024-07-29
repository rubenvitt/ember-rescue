// StatusButton.component.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusButtonComponent } from './StatusButton.component.tsx';
import { StatusDto } from '../../../types/app/status.types.js';

describe('StatusButtonComponent', () => {

  const mockOnClick = vi.fn();

  const statusItems: StatusDto[] = [
    { id: '1', code: 1, beschreibung: 'b-1', bezeichnung: 'Einsatzbereit auf Funk' },
    { id: '2', code: 2, beschreibung: 'b-2', bezeichnung: 'Einsatzbereit auf Wache / Standort' },
    { id: '3', code: 3, beschreibung: 'b-3', bezeichnung: 'Einsatzübernahme (ausgerückt)' },
    { id: '4', code: 4, beschreibung: 'b-4', bezeichnung: 'Einsatzort (vor Ort)' },
    { id: '5', code: 5, beschreibung: 'b-5', bezeichnung: 'Sprechwunsch' },
    { id: '6', code: 6, beschreibung: 'b-6', bezeichnung: 'Nicht einsatzbereit / außer Dienst' },
    { id: '7', code: 7, beschreibung: 'b-7', bezeichnung: 'Einsatzgebunden' },
    { id: '8', code: 8, beschreibung: 'b-8', bezeichnung: 'Bedingt verfügbar / am Zielort' },
    { id: '9', code: 9, beschreibung: 'b-9', bezeichnung: 'Quittung / Datenabfrage (nur besondere Fahrzeuge)' },
    { id: '0', code: 0, beschreibung: 'b-0', bezeichnung: 'Priorisierter Sprechwunsch' },
  ];

  statusItems.forEach((item) => {
    it(`renders correctly with status code ${item.code} and bezeichnung ${item.bezeichnung}`, () => {
      const { getByText } = render(
        <StatusButtonComponent onClick={mockOnClick} item={item} className="custom-class" />,
      );

      expect(getByText(`${item.code}`)).toBeInTheDocument();
      expect(getByText(`${item.code}`)).toHaveClass('font-bold text-xl');
      expect(getByText(`${item.bezeichnung}`)).toBeInTheDocument();
      expect(getByText(`${item.bezeichnung}`)).toHaveClass('font-light text-xs');
    });
  });

  it('triggers the onClick handler when clicked', () => {
    const status: StatusDto = {
      id: '2',
      code: 2,
      beschreibung: 'beschreibung-2',
      bezeichnung: 'Einsatzbereit auf Wache / Standort',
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
      beschreibung: 'beschreibung-3',
      bezeichnung: 'Einsatzübernahme (ausgerückt)',
    };
    const { container } = render(
      <StatusButtonComponent onClick={mockOnClick} item={status} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('bg-yellow-200/30 text-yellow-900 ring-yellow-500 dark:bg-yellow-800/30 dark:text-yellow-100 hover:bg-yellow-500/30');
  });

  it('merges the provided custom class with statusLabel classes', () => {
    const status: StatusDto = { id: '5', code: 5, beschreibung: 'beschreibung-5', bezeichnung: 'Sprechwunsch' };
    const { container } = render(
      <StatusButtonComponent onClick={mockOnClick} item={status} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('bg-purple-200/30 text-purple-900 ring-purple-500 dark:bg-purple-800/30 dark:text-purple-100 hover:bg-purple-500/30');
  });
});