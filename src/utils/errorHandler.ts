export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errorCode: string;

    constructor(
        message: string,
        statusCode = 500,
        errorCode = 'INTERNAL_ERROR',
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const handleError = (error: Error | AppError): {statusCode: number; body: string;} => {

    if (error instanceof AppError) 
    {
        console.error(`[${error.errorCode}] ${error.message}`);
        return {
            statusCode: error.statusCode,
            body: JSON.stringify({
                error: true,
                message: error.message,
                code: error.errorCode,
                isOperational: error.isOperational
            })
        };
    }

    console.error('[UNKNOWN_ERROR]', error);
    return {
        statusCode: 500,
        body: JSON.stringify({
            error: true,
            message: 'An unexpected error occurred',
            code: 'INTERNAL_ERROR',
            isOperational: false
        })
    };
};