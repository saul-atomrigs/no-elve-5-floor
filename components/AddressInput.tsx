import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, size, spacing } from '@/design-tokens';

interface AddressInputProps {
  address: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  clearInput: () => void;
}

/**
 * 주소 입력 창
 */
const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onChangeText,
  onSubmitEditing,
  clearInput,
}) => {
  return (
    <View style={styles.inputContainer}>
      {/* 주소 입력 창 */}
      <TextInput
        style={styles.input}
        placeholder='송파동 123-45, 신림로 67'
        value={address ?? ''}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={colors.placeholderText}
      />
      {/* 주소 입력 창 오른쪽에 있는 버튼 */}
      {address?.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
          <Ionicons name='close-circle' size={size.lineWidth.micro} color={colors.border} />
        </TouchableOpacity>
      )}
    </View>
  );
};

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

export default AddressInput;
