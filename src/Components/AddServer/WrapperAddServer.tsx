"use client";
import AddServer from "./AddServer";
import { useAddServerMutation } from "@/redux/apiSlice/addServerApi";
import { AddServerSchema } from "@/types/addServerType";

export default function WrapperAddServer() {
  const [addServer] = useAddServerMutation();

  const handleTrigger = () => {
    // Действия после успешного добавления сервера
    console.log("Сервер успешно добавлен");
  };

  return (
    <AddServer
      title="Добавить сервер"
      trigger={handleTrigger}
      successMessage="Сервер добавлен!"
      schema={AddServerSchema}
      mutation={addServer}
    />
  );
}
