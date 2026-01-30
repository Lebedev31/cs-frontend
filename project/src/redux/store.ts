import { configureStore } from "@reduxjs/toolkit";
import { csServerApi } from "./apiSlice/csServerApi";
import { mainSlice } from "./slice/main.slice";
import { registrationApi } from "./apiSlice/registrationApi";
import { authApi } from "./apiSlice/authApi";
import { settingAccountApi } from "./apiSlice/settingAccountApi";
import authReducer from "./slice/auth.slice";
import { addServerApi } from "./apiSlice/addServerApi";
import { paymentApi } from "./apiSlice/paymentApi";
import { commentsApi } from "./apiSlice/commentsApi";
import { ratingApi } from "./apiSlice/ratingApi";
import { contactsApi } from "./apiSlice/contactsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

// Читаем токен из localStorage, если код выполняется на клиенте
const token =
  typeof window !== "undefined" ? localStorage.getItem("login") : null;

// Формируем preloadState
const preloadedState = {
  auth: {
    isLoggedIn: !!token,
  },
};

export const store = configureStore({
  reducer: {
    [csServerApi.reducerPath]: csServerApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [settingAccountApi.reducerPath]: settingAccountApi.reducer,
    [addServerApi.reducerPath]: addServerApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [ratingApi.reducerPath]: ratingApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    main: mainSlice.reducer,
    auth: authReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      csServerApi.middleware,
      registrationApi.middleware,
      authApi.middleware,
      settingAccountApi.middleware,
      addServerApi.middleware,
      paymentApi.middleware,
      commentsApi.middleware,
      ratingApi.middleware,
      contactsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
