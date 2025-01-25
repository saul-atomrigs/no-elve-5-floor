import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { spacing } from '@/design-tokens';

interface BuildingInfoImageProps {
  hasElevator: boolean;
}

const BuildingInfoImage: React.FC<BuildingInfoImageProps> = ({
  hasElevator,
}) => {
  return (
    <Image
      source={
        hasElevator
          ? require('@/assets/images/elevator.webp')
          : require('@/assets/images/stairs.webp')
      }
      style={styles.image}
      resizeMode='contain'
      testID='building-image'
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
    marginTop: spacing.md,
  },
});

export default BuildingInfoImage;
