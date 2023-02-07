const MIN_NAME_LENGTH = 3;

exports.getValidationErrorsForTask = function (taskname, status, assigneduser) {
  const validationErrors = [];

  if (!taskname || !status || !assigneduser) {
    validationErrors.push("Please fill in all the fields");
  } else if (
    taskname.length < MIN_NAME_LENGTH ||
    status.length < MIN_NAME_LENGTH ||
    assigneduser.length < MIN_NAME_LENGTH
  ) {
    validationErrors.push(
      "The fields needs to be at least " + MIN_NAME_LENGTH + " characters."
    );
  }

  return validationErrors;
};
