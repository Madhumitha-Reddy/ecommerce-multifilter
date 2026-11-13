export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} was not found.` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const databaseUnavailable = error.name === 'MongooseServerSelectionError'
    || error.name === 'MongoNetworkError'
    || error.name === 'MongoServerError'
    || /ECONNREFUSED|MongoServerSelectionError|buffering timed out|connection.*closed/i.test(error.message || '');
  const status = error.status || (databaseUnavailable ? 503 : 500);
  res.status(status).json({ success: false, message: databaseUnavailable ? 'Database unavailable. Check the MongoDB connection and try again.' : error.message || 'Internal server error.' });
}
