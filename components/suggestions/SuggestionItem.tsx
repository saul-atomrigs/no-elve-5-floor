import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface SuggestionItemProps {
  address: string;
  type: string;
  onSelect: (address: string) => void;
}

/**
 * 주소 추천 리스트 아이템
 */
export default function SuggestionItem({
  address,
  type,
  onSelect,
}: SuggestionItemProps) {
  return (
    <TouchableOpacity onPress={() => onSelect(address)}>
      <View style={styles.suggestionItem}>
        <Text style={styles.suggestionText}>{address}</Text>
        <Text style={styles.suggestionType}>{type}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  suggestionItem: {
    padding: spacing.md,
    borderBottomWidth: size.lineWidth.micro,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  suggestionType: {
    fontSize: typography.fontSize.sm,
    color: colors.placeholderText,
  },
});
