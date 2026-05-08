export type UserSummary = {
  id: string;
  username: string;
  email: string;
};

export type UserProfile = UserSummary & {
  bio?: string;
  profileImage?: string;
};

export type RecipeComment = {
  _id: string;
  userId?: string;
  userName?: string;
  text: string;
  createdAt?: string;
};

export type RecipeOwner = string | { _id: string };

export type AiCalorieEstimate = {
  totalCalories?: number;
  caloriesPerServing?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  suggestion?: string;
};

export type Recipe = {
  _id: string;
  title: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  category?: string;
  image?: string;
  cookingTime?: string;
  videoUrl?: string;
  favoritesCount?: number;
  createdBy?: RecipeOwner;
  comments?: RecipeComment[];
  averageRating?: number;
  ratingsCount?: number;
  myRating?: number | null;
  aiCalorieEstimate?: AiCalorieEstimate | null;
};

export type FavoriteItem = {
  _id: string;
  recipe?: Recipe | string | null;
};

export type AuthResponse = {
  message?: string;
  token: string;
  user: UserSummary;
};

export type RecipePayload = {
  title: string;
  description: string;
  category: string;
  image: string;
  cookingTime?: string;
  videoUrl?: string;
  ingredients?: string[];
  steps?: string[];
};

export type CommentResponse = {
  message?: string;
  comments: RecipeComment[];
};

export type RatingResponse = {
  message?: string;
  score: number;
  averageRating: number;
  ratingsCount: number;
};

export type ToggleFavoriteResponse = {
  favorited: boolean;
  favoritesCount?: number;
  message?: string;
};

export type ProfileUpdatePayload = {
  username: string;
  email: string;
  bio?: string;
  profileImage?: string;
  password?: string;
};

export type ProfileUpdateResponse = {
  message?: string;
  user: UserProfile;
};
