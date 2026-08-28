import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';

const app = express()
if(process.env.NODE_ENV === "production"){
    app.set("trust proxy", 1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    }
    
    const message = err instanceof Error ? err.message : "Internal Server Error";

    return res.status(500).json({
        success: false,
        message
    });
};

app.use(errorHandler);

export default app;
