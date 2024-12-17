import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { OptaInput } from './OptaInput.component.tsx';
import { useOpta } from '../../../hooks/opta.hook.ts';
import { userEvent } from '@testing-library/user-event';

// Mock the useOpta hook
vi.mock('../../../hooks/opta.hook', () => ({
  useOpta: vi.fn(),
}));

const mockFunctionOpta = {
  data: {
    data: [
      { code: '1', description: 'Notarzt', label: 'Notarzt' },
      { code: '2', description: 'RTW', label: 'RTW' },
    ],
  },
  isLoading: false,
};

describe('OptaInput', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useOpta as Mock).mockReturnValue({ functionOpta: mockFunctionOpta });
  });

  it('renders in default mode with all input fields', () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    // Check for presence of all input fields
    expect(screen.getByPlaceholderText('BA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('FW')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ort')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('40')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1')).toBeInTheDocument();
  });

  it('switches between structured and freetext mode', async () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    // Initial structured mode
    expect(screen.getByPlaceholderText('BA')).toBeInTheDocument();

    // Switch to freetext mode
    const freetextButton = screen.getByRole('button');
    await userEvent.click(freetextButton);

    // Check freetext input is present
    expect(screen.getByPlaceholderText('NI DRK Uelzen 40-12-1')).toBeInTheDocument();

    // Switch back to structured mode
    await userEvent.click(freetextButton);
    expect(screen.getByPlaceholderText('BA')).toBeInTheDocument();
  });

  it('calls onChange when structured inputs change', async () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    // Type in district field
    const districtInput = screen.getByPlaceholderText('BA');
    await userEvent.type(districtInput, 'NI');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        district: 'NI',
      }),
    );

    // Type in BOS code field
    const bosCodeInput = screen.getByPlaceholderText('FW');
    await userEvent.type(bosCodeInput, 'DRK');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bosCode: 'DRK',
      }),
    );
  });

  it('handles freetext input correctly', async () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    // Switch to freetext mode
    const freetextButton = screen.getByRole('button');
    await userEvent.click(freetextButton);

    // Type in freetext
    const freetextInput = screen.getByPlaceholderText('NI DRK Uelzen 40-12-1');
    await userEvent.type(freetextInput, 'NI DRK Test');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        freetext: 'NI DRK Test',
      }),
    );
  });

  it('displays initial value correctly', () => {
    const initialValue = {
      bosCode: 'DRK',
      district: 'NI',
      functionCode: '2',
      localCode: '40',
      orderNumber: '1',
      ort: 'Test',
      supplement: '',
      fullOpta: 'NI DRK Test 40-2-1',
      id: '1',
    };

    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} value={initialValue} />);

    // Should switch to freetext mode and display the fullOpta
    expect(screen.getByDisplayValue('NI DRK Test 40-2-1')).toBeInTheDocument();
  });

  it('handles select inputs for predefined options', async () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    // Open district select
    const districtSelect = screen.getByPlaceholderText('BA');
    await userEvent.click(districtSelect);

    // Check if options are rendered
    expect(screen.getByText('Niedersachsen')).toBeInTheDocument();
    expect(screen.getByText('Bund')).toBeInTheDocument();

    // Select an option
    await userEvent.click(screen.getByText('Niedersachsen'));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        district: 'NI',
      }),
    );
  });

  it('calls onBlur when focus is lost', async () => {
    render(<OptaInput onChange={mockOnChange} onBlur={mockOnBlur} />);

    const districtInput = screen.getByPlaceholderText('BA');
    await userEvent.type(districtInput, 'NI');
    fireEvent.blur(districtInput);

    expect(mockOnBlur).toHaveBeenCalled();
  });
});
