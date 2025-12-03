const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidate = require("../utilities/review-validation");

// Process adding a new review
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.addReviewRules(),
  reviewValidate.checkReviewErrors,
  utilities.handleErrors(reviewController.addReview)
);

// Deliver edit review view
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview) // match your controller
);

// Process review update
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.addReviewRules(),
  reviewValidate.checkReviewErrors,
  utilities.handleErrors(reviewController.updateReview)
);

// Process review delete
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
