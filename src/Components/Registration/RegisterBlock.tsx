"use client";
import Login from "./Login/Login";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Registration from "./Register/Register";

export type RegistrationProps = {
  setToggle: (toggle: boolean) => void;
};

export default function RegisterBlock() {
  const [toggle, setToggle] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "success") {
      setToggle(false);
      toast.success("Регистрация прошла успешно");
    }

    if (message === "error") {
      setToggle(true);
      toast.error("При подтверждении email произошла ошибка");
    }
  }, [searchParams]);
  return (
    <div>
      {toggle ? (
        <Registration setToggle={setToggle} />
      ) : (
        <Login setToggle={setToggle} />
      )}
    </div>
  );
}
