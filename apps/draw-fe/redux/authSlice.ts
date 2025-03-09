import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  user: {
    name: string;
    email: string;
    password: string;
    id: string;
    photo?: string;
  } | null;
  token: string | null;
  loading: boolean;
}

const initialState = {
  user: {
    name: "",
    email: "",
    password: "",
    id: "",
    photo: "",
  } as AuthState["user"],
  token: Cookies.get("token") || null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set("token", action.payload, { expires: 7 });
    },
    clearToken: (state) => {
      state.token = null;
      Cookies.remove("token");
    },
  },
});

export const { setUser, setLoading, setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
