/**
 * Standardized API Response Utility
 * Provides consistent response format across all API endpoints
 */

export class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(res, message = "An error occurred", statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  static created(res, data = null, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static conflict(res, message = "Resource conflict") {
    return this.error(res, message, 409);
  }

  static validationError(res, errors) {
    return this.error(res, "Validation failed", 422, errors);
  }

  static tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, 429);
  }

  static internalServerError(res, message = "Internal server error") {
    return this.error(res, message, 500);
  }

  static serviceUnavailable(res, message = "Service unavailable") {
    return this.error(res, message, 503);
  }
}

export class PaginatedResponse {
  static success(res, data, pagination, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export class ErrorHandler {
  static handleValidationError(error) {
    const errors = {};
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }
    return errors;
  }

  static handleMongoError(error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return `${field} already exists`;
    }
    return error.message;
  }

  static handleJWTError(error) {
    if (error.name === "JsonWebTokenError") {
      return "Invalid token";
    }
    if (error.name === "TokenExpiredError") {
      return "Token expired";
    }
    return "Token error";
  }
}

export default ApiResponse; 