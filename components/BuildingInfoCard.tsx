import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, size, spacing, typography } from '@/design-tokens';

interface BuildingInfoCardProps {
  buildingInfo: any;
  isLoading: boolean;
  error: any;
}

/**
 * 빌딩 정보 카드
 */
const BuildingInfoCard: React.FC<BuildingInfoCardProps> = ({ buildingInfo, isLoading, error }) => {
  return (
    <View style={styles.card}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : buildingInfo ? (
        /** 빌딩 정보 카드 내용 */
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{buildingInfo.newPlatPlc}</Text>
          <Text style={styles.cardTitleSub}>{buildingInfo.platPlc}</Text>
          <Text>층수: {buildingInfo.grndFlrCnt}층</Text>
          <Text
            style={[
              styles.warningText,
              buildingInfo.rideUseElvtCnt > 0 ? styles.blueText : null,
            ]}
          >
            엘리베이터: {buildingInfo.rideUseElvtCnt > 0 ? '있음' : '없음'}
            {buildingInfo.rideUseElvtCnt === 0 && (
              <Ionicons name='warning' size={size.lineWidth.micro} color={colors.highlight} />
            )}
          </Text>
        </View>
      ) : (
        <Text>위 검색창에서 주소를 입력해주세요 (서울 지역 서비스)</Text>
      )}
      {/* 엘리베이터/계단 이미지 */}
      {buildingInfo && (
        <Image
          source={
            buildingInfo.rideUseElvtCnt > 0
              ? require('../../assets/images/elevator.webp')
              : require('../../assets/images/stairs.webp')
          }
          style={styles.image}
          resizeMode='contain'
        />
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
  cardContent: {
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  cardTitleSub: {
    fontSize: typography.fontSize.md,
    color: colors.placeholderText,
  },
  warningText: {
    color: colors.highlight,
  },
  blueText: {
    color: colors.agendaToday,
  },
  image: {
    width: '100%',
    height: 400,
    marginTop: spacing.md,
  },
});

export default BuildingInfoCard;