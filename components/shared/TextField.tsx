import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'username' | 'off';
  returnKeyType?: 'done' | 'next' | 'go' | 'search';
  onSubmitEditing?: () => void;
  multiline?: boolean;
  maxLength?: number;
  editable?: boolean;
}

export function TextField({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  multiline = false,
  maxLength,
  editable = true,
}: TextFieldProps) {
  const { colors, radius, fontSizes } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, fontSize: fontSizes.sm },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: fontSizes.md,
              minHeight: multiline ? 100 : undefined,
            },
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure((s) => !s)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.iconSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={[styles.error, { color: colors.error, fontSize: fontSizes.xs }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  error: {
    marginTop: 2,
  },
});
