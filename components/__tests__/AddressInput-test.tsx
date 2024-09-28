import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddressInput from '../AddressInput';

describe('AddressInput', () => {
  const mockOnChangeText = jest.fn();
  const mockOnSubmitEditing = jest.fn();
  const mockClearInput = jest.fn();

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <AddressInput
        address=""
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
        clearInput={mockClearInput}
      />
    );

    expect(getByPlaceholderText('송파동 123-45, 신림로 67')).toBeTruthy();
  });

  it('calls onChangeText when text is changed', () => {
    const { getByPlaceholderText } = render(
      <AddressInput
        address=""
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
        clearInput={mockClearInput}
      />
    );

    const input = getByPlaceholderText('송파동 123-45, 신림로 67');
    fireEvent.changeText(input, '123 Main St');

    expect(mockOnChangeText).toHaveBeenCalledWith('123 Main St');
  });

  it('calls onSubmitEditing when enter key is pressed', () => {
    const { getByPlaceholderText } = render(
      <AddressInput
        address=""
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
        clearInput={mockClearInput}
      />
    );

    const input = getByPlaceholderText('송파동 123-45, 신림로 67');
    fireEvent(input, 'submitEditing');  // Use fireEvent to simulate the onSubmitEditing event

    expect(mockOnSubmitEditing).toHaveBeenCalled();
  });

  it('displays the correct value', () => {
    const { getByDisplayValue } = render(
      <AddressInput
        address="테헤란로 146"
        onChangeText={mockOnChangeText}
        onSubmitEditing={mockOnSubmitEditing}
        clearInput={mockClearInput}
      />
    );

    expect(getByDisplayValue('테헤란로 146')).toBeTruthy();
  });
});
