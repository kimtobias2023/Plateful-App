import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';
import { RootState } from '@store'; // Adjust the path to your store file


// Define types for Menu and MenuState
interface Menu {
  id: number;
  name: string;
  Recipes: Array<{ id: number } | number>; // Either objects with id or just the id
}

export interface MenusState {
  byId: Record<number, Menu>;
  allIds: number[];
  recentMenuId: number | null;
}

export interface MenuState {
  menus: MenusState;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  isLoading: boolean;
  error: string | null;
}

// Initial state
export const initialState: MenuState = {
  menus: {
    byId: {},
    allIds: [],
    recentMenuId: null,
  },
  saveStatus: 'idle',
  isLoading: false,
  error: null,
};

// Async thunk for saving menus
export const saveMenus = createAsyncThunk<
  Menu[], // Return type
  void, // Argument type
  { state: RootState; rejectValue: string } // Thunk API config
>(
  'menu/saveMenus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().menu;
      const menusToSave = Object.values(state.menus.byId).map(menu => ({
        ...menu,
        Recipes: menu.Recipes.map(recipe =>
          typeof recipe === 'object' ? recipe.id : recipe
        ),
      }));

      const response = await axiosInstance.post('/mealplanning/menus/save', menusToSave);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching recent menus
export const fetchRecentMenusAsync = createAsyncThunk(
  'menu/fetchRecentMenus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = (getState() as RootState).auth.user?.id;
      const response = await axiosInstance.get(`/mealplanning/menus/user/${userId}/recent`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for adding a menu
export const addMenuAsync = createAsyncThunk(
  'menu/addMenu',
  async (menuData: Menu, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/mealplanning/menus', menuData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a menu
export const deleteMenuAsync = createAsyncThunk(
  'menu/deleteMenu',
  async (menuId: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/mealplanning/menus/${menuId}`);
      return menuId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    moveRecipeBetweenMenus: (
      state,
      action: PayloadAction<{ recipeId: number; fromMenuId: number; toMenuId: number }>
    ) => {
      const { recipeId, fromMenuId, toMenuId } = action.payload;
      const fromMenu = state.menus.byId[fromMenuId];
      const toMenu = state.menus.byId[toMenuId];

      if (!fromMenu || !toMenu) return;

      const recipeIndex = fromMenu.Recipes.findIndex(r =>
        typeof r === 'object' ? r.id === recipeId : r === recipeId
      );

      if (recipeIndex === -1) return;

      const [recipeToMove] = fromMenu.Recipes.splice(recipeIndex, 1);
      toMenu.Recipes.push(recipeToMove);
    },
    addMenu: (state, action: PayloadAction<Menu>) => {
      const menu = action.payload;
      if (!state.menus.byId[menu.id]) {
        state.menus.byId[menu.id] = menu;
        state.menus.allIds.push(menu.id);
      } else {
        state.menus.byId[menu.id] = { ...state.menus.byId[menu.id], ...menu };
      }
    },
    removeMenu: (state, action: PayloadAction<number>) => {
      const menuId = action.payload;
      delete state.menus.byId[menuId];
      state.menus.allIds = state.menus.allIds.filter(id => id !== menuId);
    },
    updateMenu: (state, action: PayloadAction<Menu>) => {
      const updatedMenu = action.payload;
      state.menus.byId[updatedMenu.id] = updatedMenu;
    },
    setSaveStatus: (state, action: PayloadAction<'idle' | 'saving' | 'success' | 'error'>) => {
      state.saveStatus = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(deleteMenuAsync.fulfilled, (state, action) => {
        const menuId = action.payload;
        delete state.menus.byId[menuId];
        state.menus.allIds = state.menus.allIds.filter(id => id !== menuId);
      })
      .addCase(fetchRecentMenusAsync.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchRecentMenusAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const recentMenus = action.payload;
      
        recentMenus.forEach(menu => {
          if (!state.menus.byId[menu.id]) {
            state.menus.byId[menu.id] = menu;
            state.menus.allIds.push(menu.id);
          }
        });
      
        // Fix: Access recentMenuId via state.menus
        state.menus.recentMenuId = recentMenus.length > 0 ? recentMenus[0].id : null;
      })      
      .addCase(fetchRecentMenusAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveMenus.fulfilled, (state, action) => {
        action.payload.forEach(savedMenu => {
          state.menus.byId[savedMenu.id] = savedMenu;
          if (!state.menus.allIds.includes(savedMenu.id)) {
            state.menus.allIds.push(savedMenu.id);
          }
        });
        state.saveStatus = 'success';
      });
  },
});

// Selectors
export const selectMenus = (state: RootState) => state.menu.menus;

export const selectRecentMenuId = createSelector(selectMenus, menus => menus.recentMenuId);

export const selectRecentMenuDetails = createSelector(
  selectMenus,
  selectRecentMenuId,
  (menus, recentMenuId) => (recentMenuId ? menus.byId[recentMenuId] : null)
);

// Export actions and reducer
export const { addMenu, removeMenu, updateMenu, setSaveStatus, moveRecipeBetweenMenus } =
  menuSlice.actions;
export default menuSlice.reducer;




