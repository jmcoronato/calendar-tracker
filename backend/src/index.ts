import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { runMigrations } from "./db/migrations";
import activitiesRouter from "./routes/activities";
import trackedRouter from "./routes/tracked";
import stateRouter from "./routes/state";
import { errorHandler } from "./middleware/errorHandler";
import passport from "./auth/passport";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Rate limiting - máximo 100 requests por 15 minutos por IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: { error: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// CORS específico para el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Límite de payload para prevenir ataques de memoria
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Session & Passport
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change';
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());

runMigrations();

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/tracked", trackedRouter);
app.use("/api/state", stateRouter);

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Backend listening on http://localhost:${PORT}`);
    }
});


