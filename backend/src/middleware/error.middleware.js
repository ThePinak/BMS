// Task:
// 1. Create Express error-handling middleware.
// 2. Read message and statusCode from custom errors.
// 3. Return default 500 for unexpected errors.
// 4. Send consistent JSON error response.
// 5. Export the middleware.

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : "Internal server error";

    return res.status(statusCode).json({
        success: false,
        message: message
    });
};

export default errorMiddleware;
