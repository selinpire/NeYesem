import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AppButton } from "./AppButton";
import { StateView } from "./StateView";
import { RootStackParamList } from "../navigation/types";
import { spacing } from "../theme/spacing";

export function AuthRequiredState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StateView title={title} description={description} />
      <AppButton title="Giris Yap" onPress={() => navigation.navigate("Login")} />
      <AppButton
        title="Kayit Ol"
        variant="secondary"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
