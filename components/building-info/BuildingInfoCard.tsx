import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, size, spacing } from '@/design-tokens';
import Loading from '../Loading';
import Error from '../Error';
import BuildingDetails from './BuildingDetails';
import BuildingInfoImage from './BuildingInfoImage';

interface BuildingInfoCardProps {
  buildingInfo: any;
  isLoading: boolean;
  error: any;
}

const BuildingInfoCard: React.FC<BuildingInfoCardProps> = ({
  buildingInfo,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  if (!buildingInfo) {
    return (
      <View style={styles.card}>
        <Text>위 검색창에서 주소를 입력해주세요 (서울 지역 서비스)</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <BuildingDetails buildingInfo={buildingInfo} />

      {buildingInfo && (
        <BuildingInfoImage hasElevator={buildingInfo.rideUseElvtCnt > 0} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: size.borderRadius.small,
    padding: spacing.md,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: size.lineWidth.micro },
    shadowOpacity: 0.25,
    shadowRadius: size.lineWidth.large,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 400,
    marginTop: spacing.md,
  },
});

export default BuildingInfoCard;
