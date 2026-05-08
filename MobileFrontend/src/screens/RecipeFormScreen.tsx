import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AuthRequiredState } from "../components/AuthRequiredState";
import { CategoryChips } from "../components/CategoryChips";
import { StateView } from "../components/StateView";
import { recipeCategories } from "../constants/categories";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/types";
import {
  addRecipe,
  deleteRecipeVideo,
  getRecipeById,
  updateRecipe,
} from "../services/recipeService";
import { getApiErrorMessage } from "../utils/errors";
import { recipeOwnerId } from "../utils/recipe";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";

const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function isValidDataImagePayload(value: string) {
  return /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value);
}

export function RecipeFormScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "RecipeForm">) {
  const { user } = useAuth();
  const isEdit = route.params.mode === "edit";
  const recipeId = route.params.recipeId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      if (!isEdit || !recipeId) {
        setInitialLoading(false);
        return;
      }

      try {
        const recipe = await getRecipeById(recipeId);
        const ownerId = recipeOwnerId(recipe);
        if (user && ownerId && user.id !== ownerId) {
          setError("Bu tarifi duzenleme yetkiniz yok.");
          return;
        }

        setTitle(recipe.title || "");
        setDescription(recipe.description || "");
        setCategory(recipe.category || "");
        setImage(recipe.image || "");
        setCookingTime(recipe.cookingTime || "");
        setVideoUrl(recipe.videoUrl || "");
        setImageName(recipe.image ? "Mevcut gorsel" : "");
      } catch (err) {
        setError(getApiErrorMessage(err, "Tarif yuklenemedi."));
      } finally {
        setInitialLoading(false);
      }
    }

    loadRecipe();
  }, [isEdit, recipeId, user]);

  const canSubmit = useMemo(() => {
    return Boolean(title.trim() && description.trim() && category.trim() && image.trim());
  }, [category, description, image, title]);

  if (!user) {
    return (
      <View style={styles.screen}>
        <AuthRequiredState
          title="Tarif eklemek icin giris gerekli"
          description="Bu ekran webdeki add/edit tarif akisinin mobil karsiligidir."
        />
      </View>
    );
  }

  if (initialLoading) {
    return (
      <View style={styles.screen}>
        <StateView title="Tarif yukleniyor..." loading />
      </View>
    );
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin gerekli", "Galeriden gorsel secmek icin izin vermelisiniz.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
      allowsEditing: true,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType || "image/jpeg";
    if (!allowedMimeTypes.has(mimeType)) {
      Alert.alert("Gecersiz gorsel", "Yalnizca JPG, PNG veya WEBP gorsel kullanabilirsiniz.");
      return;
    }
    if (!asset.base64) {
      Alert.alert("Hata", "Secilen gorsel okunamadi.");
      return;
    }

    const payload = `data:${mimeType};base64,${asset.base64}`;
    if (!isValidDataImagePayload(payload)) {
      Alert.alert("Hata", "Gecersiz gorsel icerigi.");
      return;
    }

    setImage(payload);
    setImageName(asset.fileName || "Secilen gorsel");
  }

  async function handleRemoveVideo() {
    if (!isEdit || !recipeId) {
      setVideoUrl("");
      return;
    }
    try {
      await deleteRecipeVideo(recipeId);
      setVideoUrl("");
    } catch (err) {
      Alert.alert("Hata", getApiErrorMessage(err, "Video kaldirilamadi."));
    }
  }

  async function handleSubmit() {
    if (!canSubmit) {
      Alert.alert("Eksik bilgi", "Baslik, aciklama, kategori ve gorsel zorunludur.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        image: image.trim(),
        cookingTime: cookingTime.trim(),
        videoUrl: videoUrl.trim(),
      };

      if (isEdit && recipeId) {
        await updateRecipe(recipeId, payload);
      } else {
        await addRecipe(payload);
      }

      navigation.replace("MyRecipes");
    } catch (err) {
      setError(getApiErrorMessage(err, isEdit ? "Tarif guncellenemedi." : "Tarif eklenemedi."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEdit ? "Tarifi Duzenle" : "Yeni Tarif"}</Text>
      <Text style={styles.subtitle}>
        Webdeki form mantigi korunur: baslik, aciklama, kategori, gorsel, sure ve istege bagli video URL.
      </Text>

      <AppInput label="Tarif basligi" value={title} onChangeText={setTitle} />
      <AppInput
        label="Tarif aciklamasi"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Kategori</Text>
        <CategoryChips
          categories={recipeCategories}
          selected={category}
          onSelect={setCategory}
        />
      </View>

      <AppInput
        label="Tahmini yapilis suresi"
        value={cookingTime}
        onChangeText={setCookingTime}
        placeholder="Orn: 30 dk"
      />
      <AppInput
        label="Video URL"
        autoCapitalize="none"
        value={videoUrl}
        onChangeText={setVideoUrl}
        placeholder="https://youtube.com/..."
      />

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Tarif gorseli</Text>
        <View style={styles.imageActions}>
          <AppButton title="Galeriden Sec" onPress={handlePickImage} />
          {image ? <AppButton title="Kaldir" variant="secondary" onPress={() => {
            setImage("");
            setImageName("");
          }} /> : null}
          {isEdit && videoUrl ? (
            <AppButton title="Videoyu Sil" variant="ghost" onPress={handleRemoveVideo} />
          ) : null}
        </View>
        {imageName ? <Text style={styles.helper}>{imageName}</Text> : null}
        {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}
      </View>

      {error ? <StateView title={error} /> : null}

      <AppButton
        title={isEdit ? "Degisiklikleri Kaydet" : "Tarifi Ekle"}
        onPress={handleSubmit}
        loading={loading}
        disabled={!canSubmit}
      />
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
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  imageActions: {
    gap: spacing.sm,
  },
  helper: {
    color: colors.textSecondary,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
});
