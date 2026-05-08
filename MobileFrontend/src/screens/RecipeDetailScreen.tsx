import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../components/AppButton";
import { FavoriteButton } from "../components/FavoriteButton";
import { RatingStars } from "../components/RatingStars";
import { RecipeVideoCard } from "../components/RecipeVideoCard";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { addRecipeComment, deleteRecipeComment } from "../services/commentService";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import { submitRecipeRating } from "../services/ratingService";
import { deleteRecipe, getRecipeById } from "../services/recipeService";
import { Recipe } from "../types";
import { getApiErrorMessage } from "../utils/errors";
import { formatCommentDate, recipeOwnerId } from "../utils/recipe";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

export function RecipeDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RecipeDetail">) {
  const { recipeId } = route.params;
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [recipeData, favorites] = await Promise.all([
        getRecipeById(recipeId),
        user ? getFavorites() : Promise.resolve([]),
      ]);
      setRecipe(recipeData);
      const favoriteIds = buildFavoriteRecipeIdSet(favorites);
      setFavorited(favoriteIds.has(String(recipeId)));
    } catch (err) {
      setError(getApiErrorMessage(err, "Tarif detayi alinamadi."));
    } finally {
      setLoading(false);
    }
  }, [recipeId, user]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner = useMemo(() => {
    const ownerId = recipeOwnerId(recipe);
    return Boolean(user && ownerId && String(user.id) === String(ownerId));
  }, [recipe, user]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <StateView title="Tarif detayi yukleniyor..." loading />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.screen}>
        <StateView title={error || "Tarif bulunamadi"} />
      </View>
    );
  }

  const currentRecipe = recipe;

  async function handleRate(score: number) {
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    try {
      setRatingLoading(true);
      setActionError("");
      const data = await submitRecipeRating(currentRecipe._id, score);
      setRecipe((prev) =>
        prev
          ? {
              ...prev,
              averageRating: data.averageRating,
              ratingsCount: data.ratingsCount,
              myRating: data.score,
            }
          : prev
      );
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Puan kaydedilemedi."));
    } finally {
      setRatingLoading(false);
    }
  }

  async function handleAddComment() {
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    if (!commentText.trim()) {
      setActionError("Yorum metni bos olamaz.");
      return;
    }
    try {
      setCommentLoading(true);
      setActionError("");
      const response = await addRecipeComment(currentRecipe._id, commentText.trim());
      setRecipe((prev) => (prev ? { ...prev, comments: response.comments } : prev));
      setCommentText("");
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Yorum gonderilemedi."));
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const response = await deleteRecipeComment(currentRecipe._id, commentId);
      setRecipe((prev) => (prev ? { ...prev, comments: response.comments } : prev));
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Yorum silinemedi."));
    }
  }

  async function handleDeleteRecipe() {
    try {
      await deleteRecipe(currentRecipe._id);
      navigation.replace("MyRecipes");
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Tarif silinemedi."));
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <Image
          source={{
            uri:
              recipe.image ||
              "https://via.placeholder.com/700x350?text=Tarif+Gorseli",
          }}
          style={styles.image}
        />
        <View style={styles.favorite}>
          <FavoriteButton
            recipeId={recipe._id}
            favorited={favorited}
            onChange={setFavorited}
          />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.meta}>{recipe.category || "Belirtilmemis"}</Text>
        {recipe.cookingTime?.trim() ? <Text style={styles.meta}>{recipe.cookingTime}</Text> : null}
      </View>

      {isOwner ? (
        <View style={styles.ownerActions}>
          <AppButton
            title="Tarifi Duzenle"
            variant="secondary"
            onPress={() => navigation.navigate("RecipeForm", { mode: "edit", recipeId: recipe._id })}
          />
          <AppButton
            title="Tarifi Sil"
            variant="danger"
            onPress={() =>
              Alert.alert("Tarifi sil", "Bu tarif silinsin mi?", [
                { text: "Vazgec", style: "cancel" },
                { text: "Sil", style: "destructive", onPress: handleDeleteRecipe },
              ])
            }
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Puanlama</Text>
        <RatingStars averageRating={recipe.averageRating} ratingsCount={recipe.ratingsCount} />
        {user ? (
          <RatingStars
            interactive
            value={recipe.myRating ?? 0}
            onSelect={handleRate}
            disabled={ratingLoading}
          />
        ) : (
          <AppButton title="Puan vermek icin giris yap" variant="secondary" onPress={() => navigation.navigate("Login")} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aciklama</Text>
        <Text style={styles.bodyText}>
          {recipe.description?.trim() || "Aciklama bulunmuyor."}
        </Text>
      </View>

      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Malzemeler</Text>
          {recipe.ingredients.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.listItem}>
              - {item}
            </Text>
          ))}
        </View>
      ) : null}

      {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adimlar</Text>
          {recipe.steps.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.listItem}>
              {index + 1}. {item}
            </Text>
          ))}
        </View>
      ) : null}

      <RecipeVideoCard videoUrl={recipe.videoUrl} />

      {recipe.aiCalorieEstimate ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI kalori tahmini</Text>
          <Text style={styles.bodyText}>
            Toplam: {Math.round(recipe.aiCalorieEstimate.totalCalories || 0)} kcal
          </Text>
          <Text style={styles.bodyText}>
            Porsiyon basi: {Math.round(recipe.aiCalorieEstimate.caloriesPerServing || 0)} kcal
          </Text>
          {recipe.aiCalorieEstimate.suggestion ? (
            <Text style={styles.bodyText}>{recipe.aiCalorieEstimate.suggestion}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yorumlar</Text>
        {user ? (
          <>
            <TextInput
              style={styles.commentInput}
              multiline
              placeholder="Tarifle ilgili dusuncelerini yaz..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
            />
            <AppButton title="Yorum Gonder" onPress={handleAddComment} loading={commentLoading} />
          </>
        ) : (
          <AppButton title="Yorum yapmak icin giris yap" variant="secondary" onPress={() => navigation.navigate("Login")} />
        )}

        {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

        {(recipe.comments || []).length === 0 ? (
          <Text style={styles.emptyText}>Henuz yorum yok.</Text>
        ) : (
          (recipe.comments || []).map((comment) => {
            const canDelete =
              user &&
              comment.userId &&
              String(comment.userId) === String(user.id);

            return (
              <View key={comment._id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.userName || "Kullanici"}</Text>
                  <Text style={styles.commentDate}>{formatCommentDate(comment.createdAt)}</Text>
                </View>
                <Text style={styles.bodyText}>{comment.text}</Text>
                {canDelete ? (
                  <AppButton
                    title="Yorumu Sil"
                    variant="ghost"
                    onPress={() => handleDeleteComment(comment._id)}
                  />
                ) : null}
              </View>
            );
          })
        )}
      </View>
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
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  favorite: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  meta: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  ownerActions: {
    gap: spacing.sm,
  },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  bodyText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  listItem: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  commentInput: {
    minHeight: 110,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    textAlignVertical: "top",
    color: colors.textPrimary,
  },
  emptyText: {
    color: colors.textSecondary,
  },
  commentCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    gap: spacing.sm,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  commentAuthor: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  commentDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
  },
});
