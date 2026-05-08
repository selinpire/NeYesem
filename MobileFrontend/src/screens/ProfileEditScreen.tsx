import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AuthRequiredState } from "../components/AuthRequiredState";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { getProfile, updateProfile } from "../services/userService";
import { getApiErrorMessage } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function ProfileEditScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ProfileEdit">) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getProfile(user.id);
        setUsername(profile.username || "");
        setEmail(profile.email || "");
        setBio(profile.bio || "");
        setProfileImage(profile.profileImage || "");
      } catch (err) {
        setError(getApiErrorMessage(err, "Profil yuklenemedi."));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.screen}>
        <AuthRequiredState
          title="Profil duzenlemek icin giris gerekli"
          description="Bu ekran yalnizca aktif kullanici icin calisir."
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <StateView title="Profil yukleniyor..." loading />
      </View>
    );
  }

  const currentUser = user;

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      const response = await updateProfile(currentUser.id, {
        username: username.trim(),
        email: email.trim(),
        bio: bio.trim(),
        profileImage: profileImage.trim(),
      });
      await updateUser({
        id: currentUser.id,
        username: response.user.username,
        email: response.user.email,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Profil guncellenemedi."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppInput label="Kullanici adi" value={username} onChangeText={setUsername} />
      <AppInput
        label="E-posta"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <AppInput
        label="Hakkimda"
        multiline
        value={bio}
        onChangeText={setBio}
      />
      <AppInput
        label="Profil fotografi URL"
        autoCapitalize="none"
        value={profileImage}
        onChangeText={setProfileImage}
      />

      {error ? <StateView title={error} /> : null}

      <AppButton title="Kaydet" onPress={handleSave} loading={saving} />
      <AppButton title="Iptal" variant="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
