import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, size, spacing, typography } from '@/design-tokens';

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name='alert-circle'
        size={size.lineWidth.xlarge}
        color={colors.highlight}
      />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    color: colors.highlight,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
});
