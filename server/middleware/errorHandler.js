import { ZodError } from 'zod';

const errorHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry detected' });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

export default errorHandler;
