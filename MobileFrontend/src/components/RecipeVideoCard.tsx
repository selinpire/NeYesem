import { Feather } from "@expo/vector-icons";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";
import { parseRecipeVideoUrl } from "../utils/video";

export function RecipeVideoCard({
  videoUrl,
}: {
  videoUrl?: string;
}) {
  const parsed = parseRecipeVideoUrl(videoUrl);
  if (!parsed) {
    return null;
  }
  const targetUrl = parsed.original;

  async function openVideo() {
    const canOpen = await Linking.canOpenURL(targetUrl);
    if (!canOpen) {
      Alert.alert("Hata", "Video baglantisi acilamadi.");
      return;
    }
    await Linking.openURL(targetUrl);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Feather name="play-circle" size={20} color={colors.primary} />
        <Text style={styles.title}>Yapilis videosu</Text>
      </View>
      <Text style={styles.description}>
        Video oynatimi uygulama ici yerine mobil deneyime daha uygun olacak sekilde dis baglanti ile acilir.
      </Text>
      <Pressable onPress={openVideo} style={styles.action}>
        <Text style={styles.actionText}>Videoyu Ac</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  action: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  actionText: {
    color: colors.white,
    fontWeight: "700",
  },
});
