import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/design-tokens';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
});

export default Loading;
