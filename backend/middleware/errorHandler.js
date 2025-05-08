/**
 * Custom error class for API errors
 * @class ApiError
 * @extends Error
 */
export class ApiError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

/**
 * Bad Request error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', data = null) {
    super(400, message, data);
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden access') {
    super(403, message);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', data = null) {
    super(409, message, data);
  }
}

/**
 * Server error (500)
 */
export class ServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

/**
 * Handle 404 errors for routes that don't exist
 */
export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.originalUrl}`));
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default to 500 server error if status code not set
  const statusCode = err.statusCode || 500;
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages
    });
  }
  
  // Handle mongoose cast errors (usually invalid IDs)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }
  
  // Handle duplicate key errors (MongoDB code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value: The ${field} is already in use`,
    });
  }
  
  // Handle jwt errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default response for all other errors
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    data: err.data || null,
    // Only include stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 