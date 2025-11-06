/**
 * Wrap an async Express handler and forward any rejected promise to next()
 * Ensures unhandled rejections are routed to the global error handler
 */
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("[asyncHandler] error:", err);
      next(err);
    });
  };
}
