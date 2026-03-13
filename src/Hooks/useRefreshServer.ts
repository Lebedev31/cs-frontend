// src/hooks/useRefreshServer.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateServer } from "@/redux/slice/main.slice";
import { useLazyGetServerByIdQuery } from "@/redux/apiSlice/csServerApi";

export function useRefreshServer() {
  const dispatch = useDispatch<AppDispatch>();
  const [trigger] = useLazyGetServerByIdQuery();

  return async (serverIpPort: string) => {
    try {
      const result = await trigger({ id: serverIpPort }).unwrap();
      if (result?.data) {
        dispatch(updateServer(result.data));
      }
    } catch (e) {
      console.error("refreshServer failed", e);
    }
  };
}
