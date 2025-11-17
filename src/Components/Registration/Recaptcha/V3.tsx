import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useEffect, useRef } from "react";

interface V3Props {
  onVerify: (token: string | null) => void;
}

export default function V3({ onVerify }: V3Props) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const hasExecuted = useRef(false);
  const isExecuting = useRef(false);

  useEffect(() => {
    const handleReCaptcha = async () => {
      // Проверяем что не выполняется и не выполнялось ранее
      if (!executeRecaptcha || hasExecuted.current || isExecuting.current) {
        return;
      }

      isExecuting.current = true;

      try {
        const token = await executeRecaptcha("registration");
        hasExecuted.current = true;
        onVerify(token);
      } catch (error) {
        console.error("Ошибка получения токена reCAPTCHA v3:", error);
        onVerify(null);
      } finally {
        isExecuting.current = false;
      }
    };

    // Небольшая задержка для стабилизации
    const timer = setTimeout(handleReCaptcha, 1000);

    return () => clearTimeout(timer);
  }, [executeRecaptcha]); // onVerify не включаем в зависимости!

  return null;
}
