import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsideEndpointsUnion, GameServer, Game } from "@/types/type";

interface InitialState {
  selectedServer: AsideEndpointsUnion;
  servers: GameServer[];
  originalServers: GameServer[];
  game: Game;
  info: {
    avatarUrl: string;
    login: string;
  };
}

const initialState: InitialState = {
  selectedServer: "CS:GO",
  servers: [],
  originalServers: [],
  game: "CS:GO",
  info: {
    avatarUrl: "",
    login: "",
  },
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setSelectedServer: (state, action: PayloadAction<AsideEndpointsUnion>) => {
      state.selectedServer = action.payload;
    },

    setServers: (state, action: PayloadAction<GameServer[]>) => {
      state.servers = action.payload;
    },

    setOriginalServers: (state, action: PayloadAction<GameServer[]>) => {
      state.originalServers = action.payload;
    },

    setGame: (state, action: PayloadAction<Game>) => {
      state.game = action.payload;
    },

    setInfo(
      state,
      action: PayloadAction<{ avatarUrl: string; login: string }>
    ) {
      state.info.avatarUrl = action.payload.avatarUrl;
      state.info.login = action.payload.login;
    },
  },
});

export const {
  setSelectedServer,
  setServers,
  setOriginalServers,
  setGame,
  setInfo,
} = mainSlice.actions;
