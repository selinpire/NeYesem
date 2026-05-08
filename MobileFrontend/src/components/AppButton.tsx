import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: Props) {
  const isDisabled = disabled || loading;
  const palette = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.textColor} />
      ) : (
        <Text style={[styles.label, { color: palette.textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const palettes = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    textColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    textColor: colors.textPrimary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    textColor: colors.textPrimary,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
    textColor: colors.white,
  },
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
});
