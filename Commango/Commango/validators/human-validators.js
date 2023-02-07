const MIN_NAME_LENGTH = 3;

exports.getValidationErrorsForHuman = function (
  firstname,
  lastname,
  email,
  city
) {
  const validationErrors = [];

  if (!firstname || !lastname || !email || !city) {
    validationErrors.push("Please fill in all the fields");
  } else if (
    firstname.length < MIN_NAME_LENGTH ||
    lastname.length < MIN_NAME_LENGTH ||
    email.length < MIN_NAME_LENGTH ||
    city.length < MIN_NAME_LENGTH
  ) {
    validationErrors.push(
      "The fields needs to be at least " + MIN_NAME_LENGTH + " characters."
    );
  }

  return validationErrors;
};
