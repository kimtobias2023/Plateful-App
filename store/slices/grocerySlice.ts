import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axiosInstance'; // Adjust path as needed
import { RootState } from '../store'; // Adjust path to your store file

// Define types for grocery list and state
interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

interface GroceryList {
  id: number;
  name: string;
  items: GroceryItem[];
  createdAt: string;
}

interface GroceryState {
  lists: GroceryList[];
  loading: boolean;
  error: string | null;
}

export const initialState: GroceryState = {
  lists: [],
  loading: false,
  error: null,
};

// Async thunk for fetching the grocery list
export const fetchGroceryList = createAsyncThunk<GroceryList[], number, { rejectValue: string }>(
  'grocery/fetchGroceryList',
  async (userId, { rejectWithValue }) => {
    try {
      console.log(`Fetching grocery lists for user ID: ${userId}`);
      const response = await axiosInstance.get<GroceryList[]>(`/groceries/lists/user/${userId}`);
      console.log('Grocery lists fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching grocery lists:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for creating a grocery list
export const createGroceryListThunk = createAsyncThunk<GroceryList, Partial<GroceryList>, { rejectValue: string }>(
  'grocery/createList',
  async (listData, { rejectWithValue }) => {
    try {
      console.log('Creating grocery list with data:', listData);
      const response = await axiosInstance.post<GroceryList>('/groceries/lists', listData);
      console.log('Grocery list created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating grocery list:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice for grocery features
export const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ listId: number; item: GroceryItem }>) => {
      const { listId, item } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.items.push(item);
      }
    },
    removeItem: (state, action: PayloadAction<{ listId: number; itemId: number }>) => {
      const { listId, itemId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      if (list) {
        list.items = list.items.filter((item) => item.id !== itemId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceryList.fulfilled, (state, action: PayloadAction<GroceryList[]>) => {
        state.lists = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchGroceryList.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchGroceryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroceryListThunk.fulfilled, (state, action: PayloadAction<GroceryList>) => {
        state.lists.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createGroceryListThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createGroceryListThunk.pending, (state) => {
        state.loading = true;
      });
  },
});

// Selectors
export const selectGroceryState = (state: RootState): GroceryState => state.grocery;
export const selectLatestGroceryList = (state: RootState): GroceryList | undefined =>
  state.grocery.lists.length > 0 ? state.grocery.lists[state.grocery.lists.length - 1] : undefined;

// Export actions and reducer
export const { addItem, removeItem } = grocerySlice.actions;
export default grocerySlice.reducer;


