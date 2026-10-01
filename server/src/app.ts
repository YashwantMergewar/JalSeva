import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { userRouter } from './routes/user.routes.js';
import { employeeRouter, activationLimiter, verifyTokenLimiter } from './routes/employee.routes.js';
import { activateAccountController, verifyTokenController } from './controller/employee.controller.js';
import { config, isProduction } from './config/env.js';

const app = express()
if (isProduction) {
    app.set("trust proxy", 1);
}

app.use(cors({
  origin: config.NODE_ENV === "development" ? true : (config.FRONTEND_URL || true),
  credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, _res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
});

// Direct auth activation endpoints (satisfies task spec /api/auth/activate-account)
app.post("/api/auth/activate-account", activationLimiter, activateAccountController);
app.post("/api/v1/auth/activate-account", activationLimiter, activateAccountController);
app.get("/api/auth/verify-token", verifyTokenLimiter, verifyTokenController);
app.get("/api/v1/auth/verify-token", verifyTokenLimiter, verifyTokenController);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);


const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            ApiResponse.error(err.message, err.errors),
        );
    }
    
    const message = err instanceof Error ? err.message : "Internal Server Error";

    return res.status(500).json(ApiResponse.error(message));
};

app.use(errorHandler);

export default app;
