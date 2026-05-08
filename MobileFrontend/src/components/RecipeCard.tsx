import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Recipe } from "../types";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";
import { truncateRecipeDescription, recipeOwnerId } from "../utils/recipe";
import { RatingStars } from "./RatingStars";
import { FavoriteButton } from "./FavoriteButton";
import { AppButton } from "./AppButton";

type Props = {
  recipe: Recipe;
  favorited?: boolean;
  showFavorite?: boolean;
  currentUserId?: string | null;
  onFavoriteChange?: (next: boolean) => void;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RecipeCard({
  recipe,
  favorited = false,
  showFavorite = true,
  currentUserId,
  onFavoriteChange,
  onPress,
  onEdit,
  onDelete,
}: Props) {
  const ownerId = recipeOwnerId(recipe);
  const isOwner = Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId));
  const description = recipe.description?.trim()
    ? truncateRecipeDescription(recipe.description)
    : "Aciklama bulunmuyor.";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Image
          source={{
            uri:
              recipe.image ||
              "https://via.placeholder.com/600x400?text=Tarif+Gorseli",
          }}
          style={styles.image}
        />
        {showFavorite ? (
          <View style={styles.favorite}>
            <FavoriteButton
              recipeId={recipe._id}
              favorited={favorited}
              onChange={onFavoriteChange}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{recipe.category || "Diğer"}</Text>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{description}</Text>
        <RatingStars
          averageRating={recipe.averageRating}
          ratingsCount={recipe.ratingsCount}
          compact
        />
        <Text style={styles.time}>{recipe.cookingTime?.trim() || "Sure belirtilmemis"}</Text>

        <View style={styles.actions}>
          <AppButton title="Detay" onPress={onPress} />
          {isOwner && onEdit ? (
            <AppButton title="Duzenle" variant="secondary" onPress={onEdit} />
          ) : null}
          {isOwner && onDelete ? (
            <AppButton title="Sil" variant="danger" onPress={onDelete} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
  },
  image: {
    width: "100%",
    height: 210,
    backgroundColor: colors.surfaceMuted,
  },
  favorite: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceMuted,
    color: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    fontWeight: "700",
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 21,
  },
  time: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
