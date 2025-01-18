import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance'; // Adjust the path as needed
import { RootState } from '@store'; // Adjust the path to your store file

// Define types for media and state
// Define types for media and state
interface MediaItem {
  id: number;
  fullUrl: string;
  s3Key?: string;
  mediaLabel: string;
}

interface MediaPosition {
  imageId: number;
  position: number;
}

export interface MediaState {
  mediaItems: MediaItem[];
  positions: MediaPosition[];
  isLoading: boolean;
  error: string | null;
}

// Export the initial state
export const initialState: MediaState = {
  mediaItems: [],
  positions: [],
  isLoading: false,
  error: null,
};

// Async thunk for uploading media
export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (
    {
      userId,
      file,
      mediaLabel,
      currentImageIdForUpdate,
    }: { userId: number; file: File; mediaLabel: string; currentImageIdForUpdate?: number },
    { dispatch }
  ) => {
    try {
      let url: string | undefined;
      let key: string | undefined;

      if (file) {
        const presignedResponse = await axiosInstance.post<{ url: string; key: string }>(
          `/users/extended-profile/generate-presigned-url/${userId}`,
          { filename: file.name, contentType: file.type }
        );
        ({ url, key } = presignedResponse.data);

        await axiosInstance.put(url!, file, { headers: { 'Content-Type': file.type } });
      }

      const uploadData = {
        s3Key: key,
        contentType: file?.type,
        mediaLabel,
        mediaId: currentImageIdForUpdate,
      };

      const confirmResponse = await axiosInstance.post<{ mediaId: number; fullUrl: string }>(
        `/users/extended-profile/confirm-photo-upload/${userId}`,
        uploadData
      );

      const newMedia: MediaItem = {
        id: currentImageIdForUpdate || confirmResponse.data.mediaId,
        fullUrl: confirmResponse.data.fullUrl,
        mediaLabel,
      };

      if (currentImageIdForUpdate) {
        dispatch(updateMedia({ id: currentImageIdForUpdate, changes: newMedia }));
      } else {
        dispatch(addMedia(newMedia));
      }

      return newMedia;
    } catch (error: any) {
      throw error;
    }
  }
);

// Async thunk for deleting media
export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (
    { userId, mediaId, mediaLabel }: { userId: number; mediaId: number; mediaLabel: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axiosInstance.delete(`/users/extended-profile/remove-profile-media/${userId}/${mediaLabel}/${mediaId}`);
      dispatch(removeMedia(mediaId));
      return mediaId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<{ imageId: number; position: number }>) => {
      const { imageId, position } = action.payload;
      const index = state.positions.findIndex(p => p.imageId === imageId);
      if (index !== -1) {
        state.positions[index] = { imageId, position };
      } else {
        state.positions.push({ imageId, position });
      }
    },
    setMedia: (state, action: PayloadAction<MediaItem[]>) => {
      state.mediaItems = action.payload;
    },
    addMedia: (state, action: PayloadAction<MediaItem>) => {
      const newMedia = {
        ...action.payload,
        fullUrl: action.payload.fullUrl || `${process.env.EXPO_PUBLIC_S3_BASE_URL}/${action.payload.s3Key}`,
      };
      const existingMediaIndex = state.mediaItems.findIndex(media => media.id === newMedia.id);

      if (existingMediaIndex !== -1) {
        state.mediaItems[existingMediaIndex] = newMedia;
      } else {
        state.mediaItems.push(newMedia);
      }
    },
    updateMedia: (state, action: PayloadAction<{ id: number; changes: Partial<MediaItem> }>) => {
      const { id, changes } = action.payload;
      const index = state.mediaItems.findIndex(media => media.id === id);

      if (index !== -1) {
        state.mediaItems[index] = { ...state.mediaItems[index], ...changes };
      }
    },
    removeMedia: (state, action: PayloadAction<number>) => {
      state.mediaItems = state.mediaItems.filter(media => media.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(uploadMedia.pending, state => {
        state.isLoading = true;
      })
      .addCase(uploadMedia.fulfilled, (state, action: PayloadAction<MediaItem>) => {
        state.isLoading = false;
        state.mediaItems.push(action.payload);
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(deleteMedia.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteMedia.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.mediaItems = state.mediaItems.filter(item => item.id !== action.payload);
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

// Export actions and reducer
export const { setMedia, updateMedia, removeMedia, setPosition, addMedia } = mediaSlice.actions;
export default mediaSlice.reducer;

// Selector for media items
export const selectMediaItems = (state: RootState) => state.media.mediaItems;


