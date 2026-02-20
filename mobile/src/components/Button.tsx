import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';
import { fontStyles } from '../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.accent : colors.textPrimary} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4, // Sharp Protocol 21 corners
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  // Variants
  button_primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  button_accent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  // Sizes
  button_small: {
    paddingVertical: 8,
  },
  button_medium: {
    paddingVertical: 12,
  },
  button_large: {
    paddingVertical: 16,
  },

  buttonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },

  // Text styles
  text: {
    ...fontStyles.button,
    color: colors.textPrimary,
    textTransform: 'uppercase', // Tactical HUD style
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  text_outline: {
    color: colors.primary,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: colors.textSecondary,
  },
  text_accent: {
    color: '#FFFFFF',
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
});
