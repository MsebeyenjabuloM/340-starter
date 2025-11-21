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

    // LOG for debugging (inspect what the model returned)
    console.log("registerAccount -> regResult:", regResult)

    // Consider success if regResult has a positive rowCount or rows length
    const success =
      (regResult && typeof regResult.rowCount === "number" && regResult.rowCount > 0) ||
      (regResult && Array.isArray(regResult.rows) && regResult.rows.length > 0)

    if (success) {
      // use the first_name we collected earlier for the flash
      req.flash(
        "notice",
        `Congratulations, you're registered ${first_name}. Please log in.`
      )
      // redirect to login so the flash message shows after a redirect
      return res.status(201).redirect("/account/login")
    }

    // FAIL CASE: re-render register with sticky fields (so user doesn't lose input)
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
