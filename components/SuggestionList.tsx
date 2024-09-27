import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface SuggestionsListProps {
  suggestions: { address: string; type: string }[];
  onSelect: (address: string) => void;
}

/**
 * 주소 추천 리스트 (주소 검색 시 나오는 추천 주소 리스트, 인접한 문자열 추천)
 */
const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onSelect }) => {
  const renderSuggestion = ({ item }: { item: { address: string; type: string } }) => (
    <TouchableOpacity onPress={() => onSelect(item.address)}>
      <View style={styles.suggestionItem}>
        <Text style={styles.suggestionText}>{item.address}</Text>
        <Text style={styles.suggestionType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderSuggestion}
      style={styles.suggestionsList}
    />
  );
};

const styles = StyleSheet.create({
  suggestionsList: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: size.borderRadius.small,
    marginTop: spacing.sm,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: size.lineWidth.micro },
    shadowOpacity: 0.25,
    shadowRadius: size.lineWidth.large,
    elevation: 5,
  },
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

export default SuggestionsList;