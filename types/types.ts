//types.ts

// Define your navigation parameter list
export type RootStackParamList = {
    dashboard: undefined;
    recipes: { recipeId: string }; // Example: Passing a recipeId to the recipes screen
    menu: undefined;
    web: { url: string }; // Example: Passing a URL to the web screen
    profile: undefined;
    login: undefined;
    signup: undefined;
  };
  

  