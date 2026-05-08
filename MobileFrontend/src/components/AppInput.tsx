import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AppInput({ label, error, style, ...props }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, props.multiline ? styles.multiline : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
  },
  multiline: {
    minHeight: 120,
    paddingTop: spacing.md,
    textAlignVertical: "top",
  },
  error: {
    fontSize: 13,
    color: colors.danger,
  },
});
