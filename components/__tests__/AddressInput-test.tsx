import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddressInput from '../address-input/AddressInput';

jest.mock('@/hooks', () => ({
  useAddressSearch: () => ({
    address: '',
    handleAddressChange: jest.fn(),
    clearInput: jest.fn(),
  }),
}));

describe('AddressInput', () => {
  const mockOnAddressSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <AddressInput onAddressSubmit={mockOnAddressSubmit} />
    );

    expect(getByPlaceholderText('송파동 123-45, 신림로 67')).toBeTruthy();
  });

  it('calls onAddressSubmit when enter key is pressed', () => {
    const { getByPlaceholderText } = render(
      <AddressInput onAddressSubmit={mockOnAddressSubmit} />
    );

    const input = getByPlaceholderText('송파동 123-45, 신림로 67');
    fireEvent(input, 'submitEditing');

    expect(mockOnAddressSubmit).toHaveBeenCalledWith('');
  });

  it('shows clear button when address is not empty', () => {
    jest.mock('@/hooks', () => ({
      useAddressSearch: () => ({
        address: '테헤란로 146',
        handleAddressChange: jest.fn(),
        clearInput: jest.fn(),
      }),
    }));

    const { getByTestId } = render(
      <AddressInput onAddressSubmit={mockOnAddressSubmit} />
    );

    expect(getByTestId('clear-button')).toBeTruthy();
  });
});
