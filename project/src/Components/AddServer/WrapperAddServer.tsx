"use client";
import AddServer from "./AddServer";
import { useAddServerMutation } from "@/redux/apiSlice/addServerApi";
import { AddServerSchema } from "@/types/addServerType";

export default function WrapperAddServer() {
  const [addServer] = useAddServerMutation();

  return (
    <AddServer
      title="Добавить сервер"
      successMessage="Сервер добавлен!"
      schema={AddServerSchema}
      mutation={addServer}
    />
  );
}
