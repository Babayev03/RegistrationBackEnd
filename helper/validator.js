const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      errors: errors.array(),
      sucess: false,
    });
  } else {
    next();
  }
};

module.exports = validate;