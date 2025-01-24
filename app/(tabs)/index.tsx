import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { AddressInput, BuildingInfoCard } from '@/components';
import { useAddress, useBuildingInfo } from '@/hooks';
import { spacing } from '@/design-tokens';

export default function HomeScreen() {
  const { buildingParams, handleAddressSubmit } = useAddress();
  const { sigunguCd, bjdongCd, platGbCd, bun, ji } = buildingParams;

  const {
    data: buildingInfo,
    isLoading,
    error,
  } = useBuildingInfo(sigunguCd, bjdongCd, platGbCd, bun, ji);

  return (
    <SafeAreaView style={styles.container}>
      <AddressInput onAddressSubmit={handleAddressSubmit} />
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
