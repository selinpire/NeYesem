import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

type Props = {
  title: string;
  description?: string;
  loading?: boolean;
};

export function StateView({ title, description, loading = false }: Props) {
  return (
    <View style={styles.card}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
