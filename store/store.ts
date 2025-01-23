import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userAuthReducer from '@userAuthSlice';
import userProfileReducer from '@userProfileSlice';
import mediaReducer from '@mediaSlice';
import recipeReducer from '@recipeSlice';
import recipeScrapeReducer from '@recipeScrapeSlice';
import recipeDetailReducer from '@recipeDetailSlice';
import selectedRecipeReducer from '@selectedRecipeSlice';
import menuReducer from '@menuSlice';
import groceryReducer from '@grocerySlice';
import audioReducer from '@audioSlice';
import themeReducer from '@themeSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: userAuthReducer,
  profile: userProfileReducer,
  media: mediaReducer,
  recipe: recipeReducer,
  recipeScrape: recipeScrapeReducer,
  recipeDetail: recipeDetailReducer,
  selectedRecipes: selectedRecipeReducer,
  menu: menuReducer,
  grocery: groceryReducer,
  audio: audioReducer,
  theme: themeReducer,
});

// Configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: Disable if you are using non-serializable data like functions in actions
    }),
});

// Export types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;





