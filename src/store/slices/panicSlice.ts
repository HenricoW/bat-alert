import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Panic } from "../../types/app.types";

const initialState = {
  panics: [] as Panic[],
  currentPanic: {
    id: 0,
    longitude: "",
    latitiude: "",
    panic_type: "",
    details: "",
    created_at: "",
    status: "Cancelled",
  } as Panic,
};

const panicSlice = createSlice({
  name: "panic",
  initialState,
  reducers: {
    setPanics: (state, action: PayloadAction<Panic[]>) => {
      state.panics = action.payload;
    },
    setCurrentPanic: (state, action: PayloadAction<Panic["id"]>) => {
      let thePanic = state.panics.find((panic) => panic.id === action.payload);
      if (thePanic) state.currentPanic = thePanic;
    },
    addPanic: (state, action: PayloadAction<Panic>) => {
      state.panics = [...state.panics, action.payload];
    },
    updatePanic: (state, action: PayloadAction<Panic>) => {
      let foundPanic = state.panics.find((panic) => panic.id === action.payload.id);
      if (foundPanic) foundPanic = action.payload;
    },
  },
});

export const panicActions = panicSlice.actions;
export default panicSlice.reducer;
