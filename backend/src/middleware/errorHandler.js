const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  const message = status === 500 ? 'Something went wrong on the server.' : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
