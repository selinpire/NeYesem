import "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.textPrimary,
    primary: colors.primary,
  },
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
