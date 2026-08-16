// Task:
// 1. Create a custom AppError class.
// 2. Extend the built-in Error class.
// 3. Accept message and statusCode in constructor.
// 4. Store both values on the error object.
// 5. Export the class.

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
