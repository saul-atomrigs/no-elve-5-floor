import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { AddressInput, SuggestionsList, BuildingInfoCard } from '@/components';
import { useAddress, useBuildingInfo } from '@/hooks';
import { spacing } from '@/design-tokens';

export default function HomeScreen() {
  const {
    address,
    suggestions,
    buildingParams,
    handleAddressChange,
    handleSuggestionSelect,
    handleAddressSubmit,
  } = useAddress();

  const { data: buildingInfo, isLoading, error } = useBuildingInfo(
    buildingParams.sigunguCd,
    buildingParams.bjdongCd,
    buildingParams.platGbCd,
    buildingParams.bun,
    buildingParams.ji
  );

  return (
    <SafeAreaView style={styles.container}>
      <AddressInput
        address={address}
        onChangeText={handleAddressChange}
        onSubmitEditing={() => handleAddressSubmit()}
        clearInput={() => handleAddressChange('')}
      />
      {suggestions.length > 0 && (
        <SuggestionsList suggestions={suggestions} onSelect={handleSuggestionSelect} />
      )}
      <BuildingInfoCard buildingInfo={buildingInfo} isLoading={isLoading} error={error} />
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