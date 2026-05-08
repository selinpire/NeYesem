import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Props = {
  averageRating?: number;
  ratingsCount?: number;
  value?: number | null;
  interactive?: boolean;
  onSelect?: (score: number) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function RatingStars({
  averageRating,
  ratingsCount,
  value,
  interactive = false,
  onSelect,
  disabled = false,
  compact = false,
}: Props) {
  const count = Number(ratingsCount) || 0;
  const hasRating = averageRating != null && !Number.isNaN(Number(averageRating)) && count > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((score) => {
          const active = interactive ? (value ?? 0) >= score : (averageRating ?? 0) >= score;
          const icon = active ? "star" : "star";
          if (!interactive) {
            return (
              <Feather
                key={score}
                name={icon}
                size={compact ? 14 : 16}
                color={active ? colors.star : colors.border}
              />
            );
          }

          return (
            <Pressable
              key={score}
              disabled={disabled}
              onPress={() => onSelect?.(score)}
              style={styles.starButton}
            >
              <Feather
                name="star"
                size={24}
                color={(value ?? 0) >= score ? colors.star : colors.border}
              />
            </Pressable>
          );
        })}
      </View>
      {!interactive && (
        <Text style={styles.caption}>
          {hasRating ? `${Number(averageRating).toFixed(1)} / 5 (${count})` : "Henuz puan yok"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    paddingRight: spacing.xs,
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
