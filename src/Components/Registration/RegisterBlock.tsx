"use client";
import Login from "./Login/Login";
import Registration from "./Register/Register";
import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export type RegistrationProps = {
  setToggle: (toggle: boolean) => void;
};

export default function RegisterBlock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRegistration = pathname === "/registration";

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "success") toast.success("Регистрация прошла успешно");
    if (message === "error")
      toast.error("При подтверждении email произошла ошибка");
  }, [searchParams]);

  // setToggle теперь просто меняет URL
  const setToggle = (val: boolean) => {
    window.location.href = val ? "/registration" : "/login";
  };

  return (
    <div>
      {isRegistration ? (
        <Registration setToggle={setToggle} />
      ) : (
        <Login setToggle={setToggle} />
      )}
    </div>
  );
}
