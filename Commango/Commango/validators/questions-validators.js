const MY_QUES_LENGTH = 10;
const MY_ANS_LENGTH = 5;

exports.getValidationErrorsForQuestions = function (ques, ans) {
  const validationErrors = [];

  if (!ques) {
    validationErrors.push("The name is missing.");
  } else if (ques.length < MY_QUES_LENGTH) {
    validationErrors.push(
      "The questions needs to be at least " + MY_QUES_LENGTH + " characters."
    );
  }

  if (!ans) {
    validationErrors.push("The answer is missing.");
  } else if (ans.length < MY_ANS_LENGTH) {
    validationErrors.push(
      "The answer needs to be at least " + MY_ANS_LENGTH + " characters."
    );
  }
  return validationErrors;
};
