/* ****************************************
*  Deliver Login View
**************************************** */
const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

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
    errors: null,
  })
}


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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 } // 1 hour
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Deliver Account Management View
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement }
