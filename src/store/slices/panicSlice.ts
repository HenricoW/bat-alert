import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewPanic, Panic } from "../../types/app.types";

const initialState = {
  panics: [] as Panic[],
  currentPanic: {
    id: 0,
    longitude: "",
    latitude: "",
    panic_type: "",
    details: "",
    created_at: "",
    status: {
      id: 2,
      name: "Canceled",
    },
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
    addPanic: (state, action: PayloadAction<NewPanic>) => {
      state.panics = [
        ...state.panics,
        { ...action.payload, id: 0, created_at: new Date().toISOString(), status: { id: 1, name: "In Progress" } },
      ];
    },
    updatePanic: (state, action: PayloadAction<Panic>) => {
      let foundPanic = state.panics.find((panic) => panic.id === action.payload.id);
      if (foundPanic) foundPanic = action.payload;
    },
  },
});

export const panicActions = panicSlice.actions;
export default panicSlice.reducer;
