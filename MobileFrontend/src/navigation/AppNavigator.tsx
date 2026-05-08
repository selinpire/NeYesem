import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { StateView } from "../components/StateView";
import { MainTabParamList, RootStackParamList } from "./types";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MyRecipesScreen } from "../screens/MyRecipesScreen";
import { ProfileEditScreen } from "../screens/ProfileEditScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RecipeDetailScreen } from "../screens/RecipeDetailScreen";
import { RecipeFormScreen } from "../screens/RecipeFormScreen";
import { RecipesScreen } from "../screens/RecipesScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: "home-outline",
            Recipes: "restaurant-outline",
            Favorites: "heart-outline",
            Profile: "person-outline",
          };

          return <Ionicons name={iconName[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Ana Sayfa" }} />
      <Tab.Screen name="Recipes" component={RecipesScreen} options={{ title: "Tarifler" }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Favoriler" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background }}>
        <StateView title="Oturum bilgisi yukleniyor..." loading />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Giris Yap" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Kayit Ol" }} />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: "Tarif Detayi" }}
      />
      <Stack.Screen
        name="RecipeForm"
        component={RecipeFormScreen}
        options={({ route }) => ({
          title: route.params.mode === "edit" ? "Tarifi Duzenle" : "Yeni Tarif",
        })}
      />
      <Stack.Screen name="MyRecipes" component={MyRecipesScreen} options={{ title: "Tariflerim" }} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: "Profili Duzenle" }}
      />
    </Stack.Navigator>
  );
}
