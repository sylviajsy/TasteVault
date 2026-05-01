import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loadingUser: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setLoadingUser: (state, action) => {
      state.loadingUser = action.payload;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const {
  setCurrentUser,
  setLoadingUser,
  setUserError,
  clearCurrentUser,
} = userSlice.actions;

/* ---------- selectors ---------- */

export const selectCurrentUser = (state) =>
  state.user.currentUser;

export const selectDisplayName = (state) => {
  const user = state.user.currentUser;

  const rawName =
    user?.user_name ||
    user?.user_email?.split("@")[0] ||
    "User";

  return (
    rawName.charAt(0).toUpperCase() +
    rawName.slice(1)
  );
};

export default userSlice.reducer;