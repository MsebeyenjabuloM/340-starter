const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 *********************************** */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Registration Error Check
 ****************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* **********************************
 *  Login Data Validation Rules
 *********************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Login Error Check
 ****************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }
  next()
}

/* **********************************
 * Account Update Validation Rules
 *********************************** */
validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ]
}

/* ******************************
 * Account Update Error Check
 ****************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
  next()
}

/* **********************************
 * Password Change Validation Rules
 *********************************** */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      )
  ]
}

/* ******************************
 * Password Change Error Check
 ****************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors,
      account_id
    })
  }
  next()
}


module.exports = validate
