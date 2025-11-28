const { body, validationResult } = require("express-validator")
const utilities = require("./index")   // Single import for all utilities

const validate = {}

/* ***************************
 * Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must contain only letters or numbers with no spaces."),
  ]
}

/* ***************************
 * Check classification data
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name, // sticky value
    })
  }
  next()
}

/* ***************************
 * Inventory Validation Rules
 * ************************** */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
  ]
}

/* ***************************
 * Check inventory data (ADD)
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    classification_id,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors,
      classificationList,
      inv_make,
      inv_model,
      classification_id,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
    })
  }

  next()
}

/* ***************************
 * Check UPDATE inventory data (NEW FUNCTION)
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    classification_id,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      classification_id,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
    })
  }

  next()
}

module.exports = validate
