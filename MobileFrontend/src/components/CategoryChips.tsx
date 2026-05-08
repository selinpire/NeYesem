import { ScrollView, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

type Props = {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const active = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[
              styles.chip,
              active ? styles.chipActive : undefined,
            ]}
          >
            <Text style={[styles.text, active ? styles.textActive : undefined]}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  textActive: {
    color: colors.white,
  },
});
