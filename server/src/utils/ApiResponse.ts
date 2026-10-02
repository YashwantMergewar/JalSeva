export interface ApiResponseBody<T = unknown> {
    success: boolean;
    message: string;
    data: T | null;
    errors: unknown;
}

class ApiResponse {
    static success<T>(
        message: string,
        data: T | null = null,
        statusCode = 200,
    ): ApiResponseBody<T> {
        return {
            success: statusCode < 400,
            message,
            data,
            errors: null,
        };
    }

    static error(
        message: string,
        errors: unknown = null,
    ): ApiResponseBody {
        return {
            success: false,
            message,
            data: null,
            errors,
        };
    }
}

export { ApiResponse };
