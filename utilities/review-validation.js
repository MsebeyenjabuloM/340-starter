const { body, validationResult } = require('express-validator');

/* **************************************
 * Validation rules for adding/updating reviews
 ****************************************/
function addReviewRules() {
  return [
    body('review_text')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Review must be at least 5 characters long.')
      .escape(),
  ];
}

/* **************************************
 * Middleware to check validation results
 ****************************************/
function checkReviewErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If errors, store in locals for view rendering
    res.locals.errors = errors.array();
    return res.redirect('back'); // go back to the page where the form was submitted
  }
  next();
}

module.exports = {
  addReviewRules,
  checkReviewErrors
};
