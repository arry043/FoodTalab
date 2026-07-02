const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");

const parseOrigins = (value) =>
    value
        ?.split(",")
        .map((origin) => normalizeOrigin(origin.trim()))
        .filter(Boolean) || [];

const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const configuredOrigins = [
    ...parseOrigins(process.env.CORS_ORIGINS),
    ...parseOrigins(process.env.FRONTEND_ORIGIN),
];

export const allowedOrigins = [
    ...new Set([
        ...configuredOrigins,
        ...(process.env.NODE_ENV === "production" ? [] : devOrigins),
    ]),
];

export const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
