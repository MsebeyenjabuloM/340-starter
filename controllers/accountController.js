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
* *************************************** */
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
    /*const { account_firstname, account_lastname, account_email, account_password } = req.body*/
    const { 
  account_firstname: first_name, 
  account_lastname: last_name, 
  account_email: email, 
  account_password: password 
} = req.body


    // call model to insert into DB
    /*const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ) */
   const regResult = await accountModel.registerAccount(
  first_name,
  last_name,
  email,
  password
)


    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }

