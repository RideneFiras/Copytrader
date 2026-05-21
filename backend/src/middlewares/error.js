import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { isProd } from '../config/env.js';

export function notFoundHandler(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err instanceof ApiError ? err.status : err.status || 500;
  const payload = {
    error: err instanceof ApiError ? err.message : status >= 500 ? 'Internal server error' : err.message,
  };
  if (err.details) payload.details = err.details;
  if (!isProd && status >= 500) payload.stack = err.stack;

  if (status >= 500) {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  } else {
    logger.warn({ status, path: req.path, msg: err.message }, 'Request error');
  }
  res.status(status).json(payload);
}
