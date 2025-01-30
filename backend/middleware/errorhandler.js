// middleware/errorHandler.js

// Middleware to handle 404 errors (route not found)
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handling middleware
export const errorHandler = (err, req, res, next) => {
  // If response status is still 200, set it to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Construct error response
  const errorResponse = {
    success: false,
    message: err.message,
    // Only add stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    res.status(400);
    errorResponse.message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(404);
    errorResponse.message = 'Resource not found';
  } else if (err.code === 11000) { // MongoDB duplicate key error
    res.status(400);
    errorResponse.message = 'Duplicate value entered';
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async handler to catch errors in async routes
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};