import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthRequiredState } from "../components/AuthRequiredState";
import { RecipeCard } from "../components/RecipeCard";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { getFavorites } from "../services/favoriteService";
import { FavoriteItem, Recipe } from "../types";
import { getApiErrorMessage, isAuthError } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!isAuthError(err)) {
        setError(getApiErrorMessage(err, "Favoriler yuklenemedi."));
      }
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
          title="Favoriler icin giris gerekli"
          description="Web uygulamasindaki gibi favoriler kullaniciya ozeldir ve token ile korunur."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Favorilerim</Text>
            <Text style={styles.subtitle}>
              Begendigin tarifler ayni backendden cekilerek burada listelenir.
            </Text>
            {loading ? <StateView title="Favoriler yukleniyor..." loading /> : null}
            {!loading && error ? <StateView title={error} /> : null}
            {!loading && !error && favorites.length === 0 ? (
              <StateView title="Henuz favori tarif yok" description="Tarif kartlarindaki kalp butonunu kullanarak favori ekleyebilirsiniz." />
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const recipe = item.recipe;
          if (!recipe || typeof recipe === "string") {
            return null;
          }
          return (
            <RecipeCard
              recipe={recipe as Recipe}
              favorited
              currentUserId={user.id}
              onFavoriteChange={(next) => {
                if (!next) {
                  setFavorites((prev) =>
                    prev.filter((favorite) => {
                      if (!favorite.recipe || typeof favorite.recipe === "string") {
                        return true;
                      }
                      return favorite.recipe._id !== recipe._id;
                    })
                  );
                }
              }}
              onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe._id })}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
