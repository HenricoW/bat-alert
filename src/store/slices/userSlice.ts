import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/app.types";

const initialState = {
  token_id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<User["access_token"]>) => {
      state.token_id = action.payload;
    },
    logOut: (state) => {
      state.token_id = initialState.token_id;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
