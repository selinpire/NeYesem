import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { RootStackParamList } from "../navigation/types";
import { registerUser } from "../services/authService";
import { getApiErrorMessage } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function RegisterScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Register">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      setMessage("");
      await registerUser(username.trim(), email.trim(), password);
      navigation.replace("Login");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Kayit sirasinda hata olustu."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Kayit Ol</Text>
        <Text style={styles.subtitle}>
          Yeni hesap olustur ve tariflerini mobilde de yonet.
        </Text>

        <AppInput label="Kullanici adi" value={username} onChangeText={setUsername} />
        <AppInput
          label="E-posta"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label="Sifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {message ? <Text style={styles.error}>{message}</Text> : null}

        <AppButton title="Kayit Ol" onPress={handleSubmit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
});
