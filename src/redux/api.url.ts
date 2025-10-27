export const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL_PROD;

export const apiImg =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_IMG
    : process.env.NEXT_PUBLIC_API_IMG_PROD;
