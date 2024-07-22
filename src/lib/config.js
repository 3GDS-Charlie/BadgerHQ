const PORT = 3000;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "PROD";
export const PROD_HOST_URL = "https://badger-hq.netlify.app";
const HOST_URLS = {
  PROD: PROD_HOST_URL,
  DEV: `http://localhost:${PORT}`
};
export const HOST_URL = HOST_URLS[ENVIRONMENT];
export const VERSION = "v0.1.0";

// SUPABASE
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// URL
