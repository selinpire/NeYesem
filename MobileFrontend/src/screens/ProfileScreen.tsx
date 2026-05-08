import { useCallback, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppButton } from "../components/AppButton";
import { AuthRequiredState } from "../components/AuthRequiredState";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { deleteAccount, getProfile } from "../services/userService";
import { UserProfile } from "../types";
import { getApiErrorMessage } from "../utils/errors";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      const data = await getProfile(user.id);
      setProfile(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Profil yuklenemedi."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) {
    return (
      <View style={styles.screen}>
        <AuthRequiredState
          title="Profil icin giris gerekli"
          description="Profil, favoriler ve kullaniciya ait tarifler token ile korunur."
        />
      </View>
    );
  }

  const currentUser = user;

  async function handleDeleteAccount() {
    try {
      await deleteAccount(currentUser.id);
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Hesap silinemedi."));
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <StateView title="Profil yukleniyor..." loading />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.screen}>
        <StateView title={error || "Profil bulunamadi"} />
      </View>
    );
  }

  const avatarLetter = profile.username?.[0]?.toUpperCase() || "K";

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.username}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.bioCard}>
          <Text style={styles.bioLabel}>Hakkimda</Text>
          <Text style={styles.bioText}>
            {profile.bio?.trim() || "Henuz bir aciklama eklenmedi."}
          </Text>
        </View>

        <View style={styles.actions}>
          <AppButton title="Profili Duzenle" onPress={() => navigation.navigate("ProfileEdit")} />
          <AppButton title="Tariflerim" variant="secondary" onPress={() => navigation.navigate("MyRecipes")} />
          <AppButton title="Favorilerim" variant="secondary" onPress={() => navigation.navigate("MainTabs", { screen: "Favorites" })} />
          <AppButton title="Cikis Yap" variant="ghost" onPress={() => logout()} />
          <AppButton
            title="Hesabi Sil"
            variant="danger"
            onPress={() =>
              Alert.alert("Hesabi sil", "Bu islem geri alinamaz. Devam etmek istiyor musunuz?", [
                { text: "Vazgec", style: "cancel" },
                { text: "Sil", style: "destructive", onPress: handleDeleteAccount },
              ])
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceMuted,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  email: {
    color: colors.textSecondary,
  },
  bioCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    gap: spacing.xs,
  },
  bioLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  bioText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
});
