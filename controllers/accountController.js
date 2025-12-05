// controllers/accountController.js
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model") // <-- added

/* ****************************************
 * Deliver Login View
 **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 * Deliver Registration View
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Process Registration
 **************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()

    const {
      account_firstname: first_name,
      account_lastname: last_name,
      account_email: email,
      account_password: password
    } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const regResult = await accountModel.registerAccount(
      first_name,
      last_name,
      email,
      hashedPassword
    )

    const success =
      (regResult && typeof regResult.rowCount === "number" && regResult.rowCount > 0) ||
      (regResult && Array.isArray(regResult.rows) && regResult.rows.length > 0)

    if (success) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${first_name}. Please log in.`
      )
      return res.status(201).redirect("/account/login")
    }

    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      first_name,
      last_name,
      email,
    })

  } catch (err) {
    console.error("Error during registration:", err)
    req.flash("notice", "An unexpected error occurred.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav: await utilities.getNav()
    })
  }
}

/* ****************************************
 * Process Login
 **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Incorrect email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
    })
  }

  const validPassword = await bcrypt.compare(account_password, accountData.password)

  if (!validPassword) {
    req.flash("notice", "Incorrect email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
    })
  }

  // remove password from object we will sign
  delete accountData.password

  // create token payload using the keys other code expects:
  const tokenPayload = {
    account_id: accountData.account_id,
    account_firstname: accountData.first_name,
    account_lastname: accountData.last_name,
    account_type: accountData.account_type,
    email: accountData.email
  }

  const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  })

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600 * 1000,
  })

  // Save to locals for immediate / same-request use if needed
  res.locals.accountData = tokenPayload

  return res.redirect("/account")
}

/* ****************************************
 * Deliver Account Management View
 **************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()

  let account_firstname = null
  let account_type = null
  let account_id = null
  let reviews = []

  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      account_firstname = decoded.account_firstname
      account_type = decoded.account_type
      account_id = decoded.account_id

      // Fetch reviews by logged-in user (returns array)
      reviews = await reviewModel.getReviewsByAccountId(account_id)
    } catch (err) {
      console.error("JWT verification error:", err)
    }
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname,
    account_type,
    account_id,
    reviews,
  })
}

/* ****************************************
 * Deliver Account Update View
 **************************************** */
async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav()
  const token = req.cookies.jwt
  let account_id = null, account_firstname = "", account_lastname = "", account_email = ""

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      account_id = decoded.account_id
      account_firstname = decoded.account_firstname
      account_lastname = decoded.account_lastname
      account_email = decoded.email
    } catch (err) {
      console.error("JWT verification error:", err)
    }
  }

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  })
}

/* ****************************************
 * Process Account Info Update
 **************************************** */
async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let nav = await utilities.getNav()

  try {
    // Note: accountModel expects first_name/last_name columns
    const result = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email)

    if (result) {
      req.flash("success", "Account information updated successfully.")
    } else {
      req.flash("error", "Failed to update account information.")
    }

    return res.redirect("/account/")
  } catch (err) {
    console.error(err)
    req.flash("error", "An unexpected error occurred.")
    return res.redirect("/account/update")
  }
}

/* ****************************************
 * Process Password Change
 **************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  let nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("success", "Password updated successfully.")
    } else {
      req.flash("error", "Failed to update password.")
    }

    return res.redirect("/account/")
  } catch (err) {
    console.error(err)
    req.flash("error", "An unexpected error occurred.")
    return res.redirect("/account/update")
  }
}

/* ****************************************
 * Deliver Logout
 **************************************** */
async function logoutAccount(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development"
    })

    req.flash("success", "You have been logged out.")
    return res.redirect("/")
  } catch (err) {
    console.error("Logout error:", err)
    req.flash("error", "An unexpected error occurred during logout.")
    return res.redirect("/account/")
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildAccountUpdate,
  updateAccountInfo,
  updatePassword,
  logoutAccount
}
