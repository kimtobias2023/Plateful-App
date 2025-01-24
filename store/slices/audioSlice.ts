import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@axiosInstance';
import { logout } from 'store/slices/authSlice';

// Define the state interface
interface AudioState {
  transcription: string | null;
  synthesizedAudioURL: string | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
export const initialState: AudioState = {
  transcription: null,
  synthesizedAudioURL: null,
  isLoading: false,
  error: null,
};

// Async thunk for uploading audio and getting transcription
export const transcribeAudio = createAsyncThunk<string, Blob, { rejectValue: string }>(
  'audio/transcribe',
  async (audioBlob, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'user-audio.ogg');
      const response = await axiosInstance.post<{ transcription: string }>('/audio/transcribe', formData);
      return response.data.transcription; // Assuming the response includes the transcription result
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to transcribe audio');
    }
  }
);

// Async thunk for synthesizing speech
export const synthesizeSpeech = createAsyncThunk<{ audioUrl: string }, { text: string; model: string; voice: string }, { rejectValue: string }>(
  'audio/synthesize',
  async ({ text, model, voice }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Blob>(
        '/audio/synthesize-speech',
        { text, model, voice },
        { responseType: 'blob' }
      );
      const audioUrl = URL.createObjectURL(response.data);
      console.log('Received audio URL:', audioUrl);
      return { audioUrl };
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

// Slice
const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    clearAudioState: (state) => {
      state.synthesizedAudioURL = null;
      state.transcription = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(synthesizeSpeech.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(synthesizeSpeech.fulfilled, (state, action: PayloadAction<{ audioUrl: string }>) => {
        state.isLoading = false;
        state.synthesizedAudioURL = action.payload.audioUrl;
      })
      .addCase(synthesizeSpeech.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to synthesize speech';
      })
      .addCase(transcribeAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(transcribeAudio.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.transcription = action.payload;
      })
      .addCase(transcribeAudio.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to transcribe audio';
      })
      .addCase(logout.fulfilled, (state) => {
        // Clear audio state on logout
        state.synthesizedAudioURL = null;
        state.transcription = null;
      });
  },
});

// Export actions and reducer
export const { clearAudioState } = audioSlice.actions;
export default audioSlice.reducer;
