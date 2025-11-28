// routes/accountRoute.js
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// GET /account/login 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// GET /account/register
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// POST /account/register 
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Default account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ****************************************
 * Task 4: Account Update Routes
 **************************************** */

// GET account update form
router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// POST account info update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),  
  regValidate.checkUpdateData,       
  utilities.handleErrors(accountController.updateAccountInfo)
)

// POST password change
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),      
  regValidate.checkPasswordData,    
  utilities.handleErrors(accountController.updatePassword)
)

// GET /account/logout
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.logoutAccount)
)


module.exports = router
