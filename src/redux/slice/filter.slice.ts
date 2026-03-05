import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  serverName: string;
  minPlayers: string;
  maxPlayers: string;
  map: string;
  mode: string;
  tags: string[];
}

const initialState: FilterState = {
  serverName: "",
  minPlayers: "",
  maxPlayers: "",
  map: "",
  mode: "",
  tags: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setServerName: (state, action: PayloadAction<string>) => {
      state.serverName = action.payload;
    },
    setMinPlayers: (state, action: PayloadAction<string>) => {
      state.minPlayers = action.payload;
    },
    setMaxPlayers: (state, action: PayloadAction<string>) => {
      state.maxPlayers = action.payload;
    },
    setMap: (state, action: PayloadAction<string>) => {
      state.map = action.payload;
    },
    setMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setServerName,
  setMinPlayers,
  setMaxPlayers,
  setMap,
  setMode,
  setTags,
  resetFilters,
} = filterSlice.actions;
