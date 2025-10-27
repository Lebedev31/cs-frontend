// useRecaptcha.ts
import { useState, useRef, useCallback } from "react";
import { useRecaptchaMutation } from "@/redux/apiSlice/registrationApi";
import { toast } from "react-toastify";

const SCORE_THRESHOLD = 0.5;

export default function useRecaptcha() {
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [v3Token, setV3Token] = useState<string | null>(null);
  const [visibleV2, setVisibleV2] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [recaptchaMutation] = useRecaptchaMutation();

  // Флаг для предотвращения повторных вызовов
  const hasVerifiedV3 = useRef(false);

  const handleVerifyV2 = useCallback((token: string | null) => {
    setV2Token(token);
  }, []);

  const handleVerifyV3 = useCallback(
    async (token: string | null) => {
      // Проверяем что не верифицировали уже и не в процессе
      if (!token || isVerifying || hasVerifiedV3.current) {
        return;
      }

      hasVerifiedV3.current = true;
      setIsVerifying(true);
      setV3Token(token);

      try {
        const result = await recaptchaMutation({ token, type: "v3" });

        if (result.data?.data) {
          const { success, score } = result.data.data;

          console.log(`reCAPTCHA v3: success=${success}, score=${score}`);

          if (!success) {
            setV3Token(null);
            hasVerifiedV3.current = false; // Разрешаем повторную попытку
            toast.error("Ошибка проверки reCAPTCHA. Попробуйте еще раз");
            return;
          }

          // Если score низкий - показываем v2
          if (score !== undefined && score < SCORE_THRESHOLD) {
            setVisibleV2(true);
            setV3Token(null);
            toast.warning("Пожалуйста, пройдите дополнительную проверку");
          }
        }
      } catch (error) {
        console.error("Ошибка верификации reCAPTCHA:", error);
        toast.error("Ошибка проверки reCAPTCHA");
        setV3Token(null);
        hasVerifiedV3.current = false; // Разрешаем повторную попытку
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, recaptchaMutation]
  );

  return {
    v2Token,
    v3Token,
    visibleV2,
    isVerifying,
    handleVerifyV2,
    handleVerifyV3,
  };
}
