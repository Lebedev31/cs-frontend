"use client";
import AddServer from "./AddServer";
import { useUpadateServerMutation } from "@/redux/apiSlice/addServerApi";
import { SettingSchema } from "@/types/addServerType";
import { useParams } from "next/navigation";

export default function WrapperSettingServer() {
  const { id } = useParams();
  const newId = id as string;
  const decodeId = decodeURIComponent(newId);
  const [updateServer] = useUpadateServerMutation();

  return (
    <AddServer
      title="Обновить настройки"
      successMessage="Сервер обновлен!"
      schema={SettingSchema}
      mutation={updateServer}
      serverId={decodeId}
    />
  );
}
