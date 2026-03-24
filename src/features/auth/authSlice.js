import { createSlice } from "@reduxjs/toolkit";
import { login } from "./authAction";
import { jwtDecode } from "jwt-decode";

const safeDecode = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const tokenFromStorage = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: safeDecode(tokenFromStorage),     // ✅ decode on load
    token: tokenFromStorage || null,
    loadingLogIn: false,
    errorLogIn: null,
    errorLogInNetWork: null,
    errorLogInPassword: null,
    errorLogInEmail: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    makeStateIsEmpityAuth: (state) => {
      const fields = [
        "loadingLogIn",
        "errorLogIn",
        "errorLogInNetWork",
        "errorLogInPassword",
        "errorLogInEmail",
      ];
      fields.forEach((field) => {
        state[field] = field.startsWith("loading") ? false : null;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loadingLogIn = true;
        state.errorLogIn = null;
        state.errorLogInNetWork = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loadingLogIn = false;
        console.log(action);

        // 1️⃣ Validation errors
        if (action.payload.error && Array.isArray(action.payload.error)) {
          action.payload.error.forEach((elm) => {
            if (elm.path?.[0] === "email") state.errorLogInEmail = elm.message;
            if (elm.path?.[0] === "password") state.errorLogInPassword = elm.message;
          });
          return;
        }

        // 2️⃣ Success
        if (action.payload.message === "Logged in successfully" && action.payload.token) {
          const token = action.payload.token;

          localStorage.setItem("token", token);
          state.token = token;
          state.user = safeDecode(token);   // ✅ مرة واحدة بس

          state.errorLogInEmail = null;
          state.errorLogInPassword = null;
          state.errorLogIn = null;
        } else {
          state.errorLogIn = action.payload.message || "Login failed";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loadingLogIn = false;
        state.errorLogInNetWork = action.payload || "Network error occurred during login";
      });
  },
});

export const { logout, makeStateIsEmpityAuth } = authSlice.actions;
export default authSlice.reducer;