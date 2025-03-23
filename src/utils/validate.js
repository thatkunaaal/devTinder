const validator = require("validator");

const validate = (req) => {
  if (!req.body.firstName || !req.body.lastName) {
    throw new Error("First and last name is mandatory!");
  }
  if (!validator.isEmail(req.body.emailId)) {
    throw new Error("Email should be in valid email format.");
  }
  if (!validator.isAlpha(req.body.firstName)) {
    throw new Error(
      "Name should not contain any numbers or special characters."
    );
  }
  if (!validator.isAlpha(req.body.lastName)) {
    throw new Error(
      "Name should not contain any numbers or special characters."
    );
  }
  if (req.body.about?.length > 100) {
    throw new Error(
      "Cannot set the about section with length greater than 100."
    );
  }
  if (req.body.skills?.length > 10) {
    throw new Error("Cannot set skills above length 10.");
  }
};

module.exports = { validate };
