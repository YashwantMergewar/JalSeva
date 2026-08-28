class ApiError extends Error {
    public readonly statusCode: number;
    public readonly data: null = null;
    public readonly success = false;
    public readonly errors: unknown;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: unknown = null,
        stack?: string,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
