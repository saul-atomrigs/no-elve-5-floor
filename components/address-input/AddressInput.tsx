import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, size, spacing } from '@/design-tokens';
import { useAddressSearch } from '@/hooks';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
}

export default function AddressInput({ onAddressSubmit }: AddressInputProps) {
  const { address, handleAddressChange, clearInput } =
    useAddressSearch(onAddressSubmit);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder='송파동 123-45, 신림로 67'
        value={address}
        onChangeText={handleAddressChange}
        onSubmitEditing={() => onAddressSubmit(address)}
        placeholderTextColor={colors.placeholderText}
      />
      {address.length && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearInput}
          testID='clear-button'
        >
          <Ionicons
            name='close-circle'
            size={size.lineWidth.micro}
            color={colors.border}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: size.lineWidth.micro,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    borderRadius: size.borderRadius.small,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingRight: spacing.xl,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});
