class ValidationError extends Error {}
class NotFoundError extends Error {}
class DuplicatedTaskError extends Error {}

function handleError(err, req, res, next) {
  if (err instanceof DuplicatedTaskError) {
    res
      .status(400)
      .render('tasks/errors/error.hbs', {
        message: 'This task already exists on your list!',
      });
    return;
  }

  if (err instanceof NotFoundError) {
    res
      .status(404)
      .render('tasks/errors/error.hbs', {
        message: 'Task with this ID does not exist!',
      });
    return;
  }

  console.error(err);

  res.status(err instanceof ValidationError ? 400 : 500);

  res.render('tasks/errors/error', {
    message: err instanceof ValidationError ? err.message : 'Try again later.',
  });
}

module.exports = {
  handleError,
  ValidationError,
  NotFoundError,
  DuplicatedTaskError,
};
