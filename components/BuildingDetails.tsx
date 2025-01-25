import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, size, spacing, typography } from '@/design-tokens';

interface BuildingDetailsProps {
  buildingInfo: any;
}

export default function BuildingDetails({
  buildingInfo,
}: BuildingDetailsProps) {
  const styles = StyleSheet.create({
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
  });

  return (
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
          <Ionicons
            name='warning'
            size={size.lineWidth.micro}
            color={colors.highlight}
          />
        )}
      </Text>
    </View>
  );
}
