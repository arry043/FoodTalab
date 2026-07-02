const DEFAULT_DEV_BACKEND_URL = "http://localhost:8000";
const DEFAULT_PROD_BACKEND_URL = "https://foodtalab-backend.onrender.com";

const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL;

export const serverUrl = (
    configuredBackendUrl ||
    (import.meta.env.DEV ? DEFAULT_DEV_BACKEND_URL : DEFAULT_PROD_BACKEND_URL)
).replace(/\/$/, "");
