/* ****************************************
*  Deliver Login View
**************************************** */
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

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

    // ✅ HASH THE PASSWORD HERE
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert hashed password into DB
    const regResult = await accountModel.registerAccount(
      first_name,
      last_name,
      email,
      hashedPassword   //  <-- THIS IS NOW HASHED
    )

    console.log("registerAccount -> regResult:", regResult)

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


async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
    })
  }

  try {
    const valid = await bcrypt.compare(account_password, accountData.password)

    if (!valid) {
      req.flash("notice", "Incorrect email or password.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        account_email,
      })
    }

    delete accountData.password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000,
    })

    return res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login failed. Please try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      account_email,
    })
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
