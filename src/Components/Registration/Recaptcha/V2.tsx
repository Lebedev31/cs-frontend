import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaV2Props {
  onVerify: (token: string | null) => void;
}

export default function RecaptchaV2({ onVerify }: RecaptchaV2Props) {
  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2 as string}
      onChange={onVerify}
    />
  );
}
