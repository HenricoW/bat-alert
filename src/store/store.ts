import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import panicReducer from "./slices/panicSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    panics: panicReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
