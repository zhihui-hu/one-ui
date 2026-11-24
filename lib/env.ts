// next inlines each `process.env.NEXT_PUBLIC_*` literal at build time, so keep them spelled out
export const env = {
  PROD: process.env.NODE_ENV === "production",
  BASE_URL: "/",
  BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
};
