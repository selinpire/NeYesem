import { useParams } from "react-router-dom";
import RecipeEditor from "../components/RecipeEditor";

export default function EditRecipe() {
  const { id } = useParams();
  return <RecipeEditor mode="edit" recipeId={id} />;
}
