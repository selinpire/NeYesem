import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Login: undefined;
  Register: undefined;
  RecipeDetail: { recipeId: string };
  RecipeForm: { mode: "add" | "edit"; recipeId?: string };
  MyRecipes: undefined;
  ProfileEdit: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Recipes: undefined;
  Favorites: undefined;
  Profile: undefined;
};
