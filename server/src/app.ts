import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { userRouter } from './routes/user.routes.js';
import { config, isProduction } from './config/env.js';

const app = express()
if (isProduction) {
    app.set("trust proxy", 1);
}

app.use(cors({
  origin: config.FRONTEND_URL || true,
  credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRouter);


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
