import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { colors, size, spacing } from '@/design-tokens';
import SuggestionItem from './SuggestionItem';

interface SuggestionsListProps {
  suggestions: { address: string; type: string }[];
  onSelect: (address: string) => void;
}

/**
 * 주소 추천 리스트 (주소 검색 시 나오는 추천 주소 리스트, 인접한 문자열 추천)
 */
const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onSelect,
}) => {
  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <SuggestionItem
          address={item.address}
          type={item.type}
          onSelect={onSelect}
        />
      )}
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
});

export default SuggestionsList;
