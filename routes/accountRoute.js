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
// router.post("/register", utilities.handleErrors(accountController.registerAccount))//
// Process registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Default account management view
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement)
)


module.exports = router
