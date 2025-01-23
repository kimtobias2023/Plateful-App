import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance, makeRequest, setAuthToken, setCsrfToken } from '@axiosInstance';
import { setMedia } from '@mediaSlice'; // Adjust the path as needed
import { setQueuedItem } from '@utils/secureStoreUtils';
import Constants from 'expo-constants';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserState {
  user: User | null;
  sessionId: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isLoading: boolean;
  error: string | null;
  verificationMessage: string | null;
  signupSuccess: boolean;
}

// Initial state
export const initialState: UserState = {
  user: null,
  sessionId: null,
  csrfToken: null,
  isAuthenticated: false,
  status: 'idle',
  isLoading: false,
  error: null,
  verificationMessage: null,
  signupSuccess: false,
};

// Thunks
export const signup = createAsyncThunk<
  User, // Fulfilled result type
  SignupPayload, // Payload type
  { rejectValue: string } // Reject type
>('user/signup', async (payload, { rejectWithValue }) => {
  try {
    await setCsrfToken();

    if (payload.password !== payload.confirmPassword) {
      return rejectWithValue('Passwords do not match.');
    }

    const { confirmPassword, ...newUser } = payload;

    const response = await makeRequest({
      method: 'post',
      url: '/users/auth/register',
      data: newUser,
    });

    console.log('Full backend response:', response);

    if (!response || !response.user) {
      throw new Error('Unexpected response from the server.');
    }

    return response.user;
  } catch (error: any) {
    console.error('Signup error:', {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    });

    return rejectWithValue(
      error.response?.data?.message || error.message || 'An unknown error occurred.'
    );
  }
});

export const signInWithGoogle = createAsyncThunk<
  void, // Return type (adjust as needed, e.g., token or user data)
  { authCode: string; codeVerifier: string }, // Arguments
  { rejectValue: string } // Error handling type
>(
  'auth/signInWithGoogle',
  async ({ authCode, codeVerifier }, { rejectWithValue }) => {
    try {
      // Store the codeVerifier securely
      await setQueuedItem('temp_code_verifier', codeVerifier);

      // Exchange the authorization code for tokens
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: authCode,
          client_id:
            Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID ||
            Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID ||
            '',
          redirect_uri: Constants.expoConfig?.extra?.GOOGLE_REDIRECT_URI || '',
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        }).toString(),
      });

      const tokens = await response.json();
      if (!response.ok || !tokens.access_token) {
        console.error('[signInWithGoogle] Token Exchange Error:', tokens);
        throw new Error(
          tokens.error_description || 'Failed to exchange auth code for tokens.'
        );
      }

      // Store tokens securely (e.g., SecureStore)
      await setQueuedItem('access_token', tokens.access_token);
      if (tokens.refresh_token) {
        await setQueuedItem('refresh_token', tokens.refresh_token);
      }

      console.log('[signInWithGoogle] Tokens successfully stored.');
      // Additional: Update Redux state or dispatch further actions as needed

    } catch (error) {
      console.error('[signInWithGoogle] Error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token exchange failed.'
      );
    }
  }
);

export const fetchGoogleUser = createAsyncThunk<
  User, // Return type: user data
  { authCode: string; codeVerifier: string }, // Payload type
  { rejectValue: string }
>('auth/fetchGoogleUser', async ({ authCode, codeVerifier }, { rejectWithValue }) => {
  try {
    await setCsrfToken();
    console.log('[fetchGoogleUser] Sending authCode and codeVerifier to the backend...');

    const response = await makeRequest({
      method: 'POST',
      url: '/users/auth/google-signin',
      data: {
        authCode,
        codeVerifier, // Ensure this is included
      },
    });

    if (!response || !response.data || !response.data.user) {
      throw new Error('Invalid response from the backend.');
    }

    console.log('[fetchGoogleUser] Backend response:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('[fetchGoogleUser] API request failed:', error);

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch Google user.');
  }
});


export const login = createAsyncThunk<
  { user: User; csrfToken: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'user/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      await setCsrfToken();

      const response = await makeRequest({
        method: 'post',
        url: '/users/auth/login',
        data: { email, password },
      });

      const { token, user, userMedia } = response;
      setAuthToken(token, 'Bearer');

      if (userMedia) dispatch(setMedia(userMedia));

      return { user, csrfToken: response.csrfToken };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message || error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed.'
      );
    }
  }
);

export const logout = createAsyncThunk('user/logout', async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/users/auth/logout');
    if (response.status === 200) {
      dispatch(setMedia([]));
      setAuthToken(null);
      return true;
    } else {
      throw new Error('Logout failed');
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const verifyEmail = createAsyncThunk<
  string,
  { token: string }
>('auth/verifyEmail', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ success: boolean; message: string }>(
      `/users/auth/verify-login/${token}`
    );

    if (!response?.data?.success) {
      console.error('Unexpected response:', response?.data);
      throw new Error(response?.data?.message || 'Verification failed.');
    }

    return response.data.message || 'Email verified successfully!';
  } catch (error: any) {
    console.error('Thunk error:', error);
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Verification failed.'
    );
  }
});

// Selectors
export const selectUser = (state: { auth: UserState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: UserState }) =>
  state.auth.isAuthenticated;
export const selectVerificationMessage = (state: { auth: UserState }) =>
  state.auth.verificationMessage;
export const selectLoadingState = (state: { auth: UserState }) => state.auth.isLoading;
export const selectSignupSuccess = (state: { auth: UserState }) =>
  state.auth.status === 'succeeded';
export const selectGoogleSignInError = (state: { auth: UserState }) => state.auth.error;
export const selectGoogleSignInLoading = (state: { auth: UserState }) => state.auth.isLoading;

// Slice
const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = false;
        state.signupSuccess = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
        state.signupSuccess = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; csrfToken: string }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.csrfToken = action.payload.csrfToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed.';
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.csrfToken = null;
    });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.verificationMessage = null;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.verificationMessage = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Verification failed.';
      });

    // Extra reducers for Google Sign-In
    builder
      .addCase(fetchGoogleUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoogleUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchGoogleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred while signing in with Google.';
      });
  },
});

export const { updateUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;

