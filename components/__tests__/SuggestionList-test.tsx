import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SuggestionsList from '../SuggestionList';

describe('SuggestionsList', () => {
  const mockSuggestions = [
    { address: '123 Main St', type: 'Home' },
    { address: '456 Elm St', type: 'Work' },
  ];

  const mockOnSelect = jest.fn();

  it('renders suggestions correctly', () => {
    const { getByText } = render(
      <SuggestionsList suggestions={mockSuggestions} onSelect={mockOnSelect} />
    );

    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('456 Elm St')).toBeTruthy();
    expect(getByText('Work')).toBeTruthy();
  });

  it('calls onSelect with the correct address when a suggestion is pressed', () => {
    const { getByText } = render(
      <SuggestionsList suggestions={mockSuggestions} onSelect={mockOnSelect} />
    );

    fireEvent.press(getByText('123 Main St'));
    expect(mockOnSelect).toHaveBeenCalledWith('123 Main St');

    fireEvent.press(getByText('456 Elm St'));
    expect(mockOnSelect).toHaveBeenCalledWith('456 Elm St');
  });
});