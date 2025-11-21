/* ****************************************
*  Deliver Login View
**************************************** */
const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver Registration View
**************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

const accountModel = require("../models/account-model")

/* ****************************************
 *  Process Registration
 * **************************************** */
async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()

    const { 
      account_firstname: first_name, 
      account_lastname: last_name, 
      account_email: email, 
      account_password: password 
    } = req.body

    // Insert into DB
    const regResult = await accountModel.registerAccount(
      first_name,
      last_name,
      email,
      password
    )

    // ---- FIXED SUCCESS CHECK ----
    if (regResult && regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${first_name}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    }

    // ---- FAIL CASE ----
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
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }
