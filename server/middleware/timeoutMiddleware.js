const timeout = (ms) => (req, res, next) => {
  const timeoutId = setTimeout(() => {
    res.status(408).json({ success: false, message: 'Request timeout' });
  }, ms);

  req.on('close', () => {
    clearTimeout(timeoutId);
  });

  next();
};

export default timeout;