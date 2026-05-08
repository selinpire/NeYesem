import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RecipeCard } from "../components/RecipeCard";
import { StateView } from "../components/StateView";
import { RootStackParamList } from "../navigation/types";
import { FEATURED_COUNT } from "../config/app";
import { useAuth } from "../context/AuthContext";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import { getAllRecipes } from "../services/recipeService";
import { Recipe } from "../types";
import { getApiErrorMessage } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      const [allRecipes, favorites] = await Promise.all([
        getAllRecipes(),
        user ? getFavorites() : Promise.resolve([]),
      ]);
      setRecipes(Array.isArray(allRecipes) ? allRecipes.slice(0, FEATURED_COUNT) : []);
      setFavoriteIds(buildFavoriteRecipeIdSet(favorites));
    } catch (err) {
      setError(getApiErrorMessage(err, "Tarifler yuklenemedi."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>NeYesem</Text>
        <Text style={styles.title}>Bugun ne pisirsek?</Text>
        <Text style={styles.subtitle}>
          Web uygulamasindaki one cikan tarif mantigi mobilde de korunuyor: anasayfa ilk bakista ilham veren tarifleri gosteriyor.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>One Cikan Tarifler</Text>
        <Text style={styles.sectionSubtitle}>Detay, favori ve puan ozeti kart uzerinden gorunur.</Text>
      </View>

      {loading ? <StateView title="Tarifler yukleniyor..." loading /> : null}
      {!loading && error ? <StateView title={error} /> : null}
      {!loading && !error && recipes.length === 0 ? (
        <StateView title="Henuz tarif yok" description="Ilk tarifi eklemek icin yeni tarif ekranina gecebilirsiniz." />
      ) : null}

      {!loading &&
        !error &&
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            favorited={favoriteIds.has(String(recipe._id))}
            onFavoriteChange={(next) =>
              setFavoriteIds((prev) => {
                const nextSet = new Set(prev);
                if (next) {
                  nextSet.add(String(recipe._id));
                } else {
                  nextSet.delete(String(recipe._id));
                }
                return nextSet;
              })
            }
            currentUserId={user?.id}
            onPress={() => navigation.navigate("RecipeDetail", { recipeId: recipe._id })}
          />
        ))}
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
    paddingBottom: spacing.xl,
  },
  hero: {
    backgroundColor: colors.secondary,
    borderRadius: 28,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  eyebrow: {
    color: "#d7efe2",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#edf7f1",
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
  },
});
