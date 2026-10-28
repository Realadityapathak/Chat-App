export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment && statusCode === 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : "Internal server error";

  res.status(statusCode).json({
    message,
    ...(isDevelopment && statusCode === 500 ? { stack: err.stack } : {}),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
};

