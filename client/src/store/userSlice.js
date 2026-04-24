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

export default userSlice.reducer;