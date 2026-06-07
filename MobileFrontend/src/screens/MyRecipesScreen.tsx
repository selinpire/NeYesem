import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../components/AppButton";
import { AuthRequiredState } from "../components/AuthRequiredState";
import { RecipeCard } from "../components/RecipeCard";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { deleteRecipe, getMyRecipes } from "../services/recipeService";
import { Recipe } from "../types";
import { getApiErrorMessage, isAuthError } from "../utils/errors";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export function MyRecipesScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "MyRecipes">) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      const data = await getMyRecipes();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (!isAuthError(err)) {
        setError(getApiErrorMessage(err, "Tarifler yuklenemedi."));
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
          title="Tariflerin icin giris gerekli"
          description="Bu ekran webdeki /my-recipes akisinin mobil karsiligidir."
        />
      </View>
    );
  }

  async function confirmDelete(recipeId: string) {
    try {
      await deleteRecipe(recipeId);
      setRecipes((prev) => prev.filter((item) => item._id !== recipeId));
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Tarif silinemedi."));
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Tariflerim</Text>
            <Text style={styles.subtitle}>
              Sunucuda kullaniciya gore filtrelenen tarifler burada listelenir.
            </Text>
            <AppButton
              title="Yeni Tarif Ekle"
              onPress={() => navigation.navigate("RecipeForm", { mode: "add" })}
            />
            {loading ? <StateView title="Tarifler yukleniyor..." loading /> : null}
            {!loading && error ? <StateView title={error} /> : null}
            {!loading && !error && recipes.length === 0 ? (
              <StateView title="Henuz tarif eklemediniz" description="Yeni tarif ekleyerek bu listeyi doldurabilirsiniz." />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            showFavorite={false}
            currentUserId={user.id}
            onPress={() => navigation.navigate("RecipeDetail", { recipeId: item._id })}
            onEdit={() => navigation.navigate("RecipeForm", { mode: "edit", recipeId: item._id })}
            onDelete={() =>
              Alert.alert("Tarifi sil", `${item.title} silinsin mi?`, [
                { text: "Vazgec", style: "cancel" },
                { text: "Sil", style: "destructive", onPress: () => confirmDelete(item._id) },
              ])
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
