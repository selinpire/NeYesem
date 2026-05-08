import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { CategoryChips } from "../components/CategoryChips";
import { RecipeCard } from "../components/RecipeCard";
import { StateView } from "../components/StateView";
import { allRecipeCategory, recipeFilterCategories } from "../constants/categories";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import {
  getAllRecipes,
  getRecipesByCategory,
  searchRecipes,
} from "../services/recipeService";
import { Recipe } from "../types";
import { getApiErrorMessage } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function RecipesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allRecipeCategory);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const favorites = await getFavorites();
      setFavoriteIds(buildFavoriteRecipeIdSet(favorites));
    } catch {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllRecipes();
      setRecipes(Array.isArray(data) ? data : []);
      setSelectedCategory(allRecipeCategory);
    } catch (err) {
      setError(getApiErrorMessage(err, "Tarifler alinamadi."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    refreshFavorites();
  }, [loadAll, refreshFavorites]);

  async function handleSearch() {
    try {
      setLoading(true);
      setError("");
      if (!searchText.trim()) {
        await loadAll();
        return;
      }
      const data = await searchRecipes(searchText.trim());
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Arama sirasinda hata olustu."));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectCategory(category: string) {
    try {
      setSelectedCategory(category);
      setLoading(true);
      setError("");
      const data =
        category === allRecipeCategory
          ? await getAllRecipes()
          : await getRecipesByCategory(category);
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Kategoriye gore tarifler alinamadi."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadAll();
            }}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Tarifler</Text>
            <Text style={styles.subtitle}>
              Webdeki arama ve kategori filtreleme akisi mobilde yatay chip ve liste deneyimine tasindi.
            </Text>
            <AppInput
              label="Tarif ara"
              placeholder="Orn: corba, pasta, firin..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <View style={styles.searchActions}>
              <AppButton title="Ara" onPress={handleSearch} />
              <AppButton title="Tumunu Getir" variant="secondary" onPress={loadAll} />
            </View>
            <CategoryChips
              categories={recipeFilterCategories}
              selected={selectedCategory}
              onSelect={handleSelectCategory}
            />
            {loading ? <StateView title="Tarifler yukleniyor..." loading /> : null}
            {!loading && error ? <StateView title={error} /> : null}
            {!loading && !error && recipes.length === 0 ? (
              <StateView title="Tarif bulunamadi" description="Arama ya da kategori sonucunda gosterilecek tarif yok." />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            favorited={favoriteIds.has(String(item._id))}
            onFavoriteChange={(next) =>
              setFavoriteIds((prev) => {
                const nextSet = new Set(prev);
                if (next) {
                  nextSet.add(String(item._id));
                } else {
                  nextSet.delete(String(item._id));
                }
                return nextSet;
              })
            }
            currentUserId={user?.id}
            onPress={() => navigation.navigate("RecipeDetail", { recipeId: item._id })}
            onEdit={() =>
              navigation.navigate("RecipeForm", { mode: "edit", recipeId: item._id })
            }
          />
        )}
      />
    </View>
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
  header: {
    gap: spacing.md,
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
  searchActions: {
    gap: spacing.sm,
  },
});
