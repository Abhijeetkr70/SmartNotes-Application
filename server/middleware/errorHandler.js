import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

const errorHandler = (err, req, res, _next) => {
  const correlationId = req.correlationId || 'unknown';
  const logContext = {
    correlationId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  if (err instanceof ZodError) {
    logger.warn({ ...logContext, errors: err.errors }, 'Validation failed');
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  if (err.name === 'CastError') {
    logger.warn({ ...logContext, error: err.message }, 'Invalid ID format');
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    logger.warn({ ...logContext, error: err.message }, 'Duplicate entry detected');
    return res.status(409).json({ success: false, message: 'Duplicate entry detected' });
  }

  logger.error({ ...logContext, error: err.message, stack: err.stack }, 'Unhandled error');
  
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    ...(isProduction ? {} : { correlationId })
  });
};

export default errorHandler;
