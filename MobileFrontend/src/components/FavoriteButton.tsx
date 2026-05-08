import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { toggleFavorite } from "../services/favoriteService";
import { getApiErrorMessage } from "../utils/errors";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";

type Props = {
  recipeId: string;
  favorited: boolean;
  onChange?: (next: boolean) => void;
};

export function FavoriteButton({ recipeId, favorited, onChange }: Props) {
  const { user } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  async function handlePress() {
    if (!user) {
      Alert.alert(
        "Giris gerekli",
        "Favorilere eklemek icin once giris yapmalisiniz.",
        [
          { text: "Vazgec", style: "cancel" },
          { text: "Giris Yap", onPress: () => navigation.navigate("Login") },
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const data = await toggleFavorite(recipeId);
      onChange?.(Boolean(data.favorited));
    } catch (error) {
      Alert.alert("Hata", getApiErrorMessage(error, "Favori islemi yapilamadi."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      disabled={loading}
      onPress={handlePress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={favorited ? "Favorilerden cikar" : "Favorilere ekle"}
    >
      <Ionicons
        name={favorited ? "heart" : "heart-outline"}
        size={20}
        color={favorited ? colors.danger : colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
