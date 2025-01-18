import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store'; // Update the path based on your project structure


// Define the initial state with a type
interface ThemeState {
    isDarkMode: boolean;
}

export const initialState: ThemeState = {
    isDarkMode: true, // Default theme
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setDarkMode: (state) => {
            state.isDarkMode = true;
        },
        setLightMode: (state) => {
            state.isDarkMode = false;
        },
    },
});

// Export actions
export const { toggleTheme, setDarkMode, setLightMode } = themeSlice.actions;

// Selector with strong typing
export const selectTheme = (state: RootState): boolean => state.theme.isDarkMode;

// Export the reducer
export default themeSlice.reducer;
