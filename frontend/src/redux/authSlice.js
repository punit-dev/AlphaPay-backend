import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/login`,
        data,
        { withCredentials: true }
      );

      if (res.status !== 200) throw Error(res.data?.message);
      return res.data?.user;
    } catch (err) {
      return rejectWithValue(err.response?.data.message);
    }
  }
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/register`,
        data,
        { withCredentials: true }
      );

      if (res.status !== 201) throw Error(res.data?.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response.data.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "/auth/verify-otp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/verify-otp`,
        data,
        { withCredentials: true }
      );

      if (res.status !== 200) throw Error(res.data?.message);
      return res.data?.message;
    } catch (err) {
      return rejectWithValue(err?.response.data.message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "/auth/resend-otp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/resend-otp`,
        { email },
        { withCredentials: true }
      );

      if (res.status !== 200) throw Error(res.data?.message);
      return res.data?.otp;
    } catch (err) {
      return rejectWithValue(err?.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/auth/logout`,
        null,
        { withCredentials: true }
      );

      if (res.status != 200) throw Error(res.data?.message);
      return res.data.message;
    } catch (err) {
      rejectWithValue(err?.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    message: null,
    otp: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearOtp: (state) => {
      state.otp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login state
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // signup state

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message || "Signup successful!";
        state.otp = action.payload.otp;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verify-otp state
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.otp = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // resend-otp state
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otp = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload;
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, clearOtp } = authSlice.actions;
export default authSlice.reducer;
