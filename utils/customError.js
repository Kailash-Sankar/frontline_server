class ValidationError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message ||
        'Something went wrong. Please check your input.';
    this.status = status || 400;
  }
}

module.exports = {
  ValidationError,
};
