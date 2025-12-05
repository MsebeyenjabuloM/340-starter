const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

/* ****************************************
 * Process Add Review
 **************************************** */
async function addReview(req, res) {
  const { review_text, inv_id, account_id } = req.body
  const result = await reviewModel.addReview(review_text, inv_id, account_id)

  if (result) {
    req.flash("notice", "Your review was successfully added.")
  } else {
    req.flash("notice", "Sorry, the review failed to post.")
  }

  // Redirect back to the vehicle detail page
  return res.redirect(`/inv/detail/${inv_id}`)
}

/* ****************************************
 * Build Edit Review View
 **************************************** */
async function buildEditReview(req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id)
    const review = await reviewModel.getReviewById(review_id)

    if (!review) {
      return next({ status: 404, message: "Review not found" })
    }

    const account_id = res.locals.accountData.account_id

    if (review.account_id !== account_id) {
      req.flash("error", "You can only edit your own reviews.")
      return res.redirect("/account")
    }

    let nav = await utilities.getNav()

    res.render("inventory/edit-review", {
      title: "Edit Review",
      nav,
      review,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Update Review
 **************************************** */
async function updateReview(req, res) {
  const { review_id, review_text } = req.body

  const review = await reviewModel.getReviewById(review_id)
  const account_id = res.locals.accountData.account_id

  // Ownership check
  if (!review || review.account_id != account_id) {
    req.flash("notice", "You do not have permission to update this review.")
    return res.redirect("/account")
  }

  const result = await reviewModel.updateReview(review_id, review_text)

  if (result) {
    req.flash("notice", "The review was successfully updated.")
  } else {
    req.flash("notice", "The review update failed.")
  }

  return res.redirect("/account")
}

/* ****************************************
 * Delete Review
 **************************************** */
async function deleteReview(req, res) {
  const { review_id } = req.body

  const review = await reviewModel.getReviewById(review_id)
  const account_id = res.locals.accountData.account_id

  // Ownership check
  if (!review || review.account_id != account_id) {
    req.flash("notice", "You do not have permission to delete this review.")
    return res.redirect("/account")
  }

  const result = await reviewModel.deleteReview(review_id)

  if (result) {
    req.flash("notice", "The review was successfully deleted.")
  } else {
    req.flash("notice", "The review could not be deleted.")
  }

  return res.redirect("/account")
}

/* ****************************************
 * Build Account Reviews View
 * Fetch reviews for the logged-in user
 **************************************** */
async function buildAccountReviews(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id

    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    let nav = await utilities.getNav()

    res.render("account/account", {
      title: "Account Management",
      nav,
      reviews,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_id,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addReview: utilities.handleErrors(addReview),
  buildEditReview: utilities.handleErrors(buildEditReview),
  updateReview: utilities.handleErrors(updateReview),
  deleteReview: utilities.handleErrors(deleteReview),
  buildAccountReviews: utilities.handleErrors(buildAccountReviews)
}

