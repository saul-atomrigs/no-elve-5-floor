import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { AddressInput, BuildingInfoCard } from '@/components';
import SuggestionsList from '@/components/suggestions/SuggestionList';
import { useAddress, useBuildingInfo, useAddressSearch } from '@/hooks';
import { spacing } from '@/design-tokens';

export default function HomeScreen() {
  const { buildingParams, handleAddressSubmit } = useAddress();
  const { sigunguCd, bjdongCd, platGbCd, bun, ji } = buildingParams;
  const { suggestions, handleSuggestionSelect } =
    useAddressSearch(handleAddressSubmit);

  const {
    data: buildingInfo,
    isLoading,
    error,
  } = useBuildingInfo(sigunguCd, bjdongCd, platGbCd, bun, ji);

  return (
    <SafeAreaView style={styles.container}>
      <AddressInput onAddressSubmit={handleAddressSubmit} />
      {suggestions.length && (
        <SuggestionsList
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
        />
      )}
      <BuildingInfoCard
        buildingInfo={buildingInfo}
        isLoading={isLoading}
        error={error}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    width: '100%',
  },
});
