import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsideEndpointsUnion, GameServer, Game } from "@/types/type";

interface InitialState {
  selectedServer: AsideEndpointsUnion;
  servers: GameServer[];
  originalServers: GameServer[];
  isLoadingServers: boolean;
  game: Game;
  info: {
    avatarUrl: string;
    login: string;
  };

  serverId: undefined | string; /// костыль для топа
}

const initialState: InitialState = {
  selectedServer: "CS:GO",
  isLoadingServers: true,
  servers: [],
  originalServers: [],
  game: "CS:GO",
  info: {
    avatarUrl: "",
    login: "",
  },
  serverId: undefined,
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
      action: PayloadAction<{ avatarUrl: string; login: string }>,
    ) {
      state.info.avatarUrl = action.payload.avatarUrl;
      state.info.login = action.payload.login;
    },

    setServerId: (state, action: PayloadAction<string | undefined>) => {
      state.serverId = action.payload;
    },

    setIsLoadingServers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingServers = action.payload;
    },

    // src/redux/slice/main.slice.ts

    updateServer: (state, action: PayloadAction<GameServer>) => {
      const updated = action.payload;
      // обновляем в servers
      const idx = state.servers.findIndex(
        (s) => s.ip === updated.ip && s.port === updated.port,
      );
      if (idx !== -1) state.servers[idx] = updated;

      // обновляем в originalServers
      const idxO = state.originalServers.findIndex(
        (s) => s.ip === updated.ip && s.port === updated.port,
      );
      if (idxO !== -1) state.originalServers[idxO] = updated;
    },
  },
});

export const {
  setSelectedServer,
  setServers,
  setOriginalServers,
  setGame,
  setInfo,
  setServerId,
  setIsLoadingServers,
  updateServer,
} = mainSlice.actions;
