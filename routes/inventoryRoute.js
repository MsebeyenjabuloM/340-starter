// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const regValidate = require("../utilities/account-validation") 
const { checkJWTToken } = require("../utilities/account-middleware")



// Build inventory by classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail page
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
)

// Inventory JSON endpoint for AJAX
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Intentional 500 test
router.get(
  "/error500",
  utilities.handleErrors(async (req, res, next) => {
    throw new Error("This is a test 500 error triggered from footer link")
  })
)

// Management view
router.get(
  "/",
  checkJWTToken,
  utilities.handleErrors(invController.buildManagement)
)


// Add classification view
router.get(
  "/add-classification",
  checkJWTToken, 
  utilities.handleErrors(invController.buildAddClassification)
)

// Add classification processing
router.post(
  "/add-classification",
  checkJWTToken, 
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get(
  "/add-inventory",
  checkJWTToken, 
  utilities.handleErrors(invController.buildAddInventory)
)

// Edit inventory page
router.get(
  "/edit/:inv_id",
  checkJWTToken, 
  utilities.handleErrors(invController.editInventoryView)
)

// Add inventory processing
router.post(
  "/add-inventory",
  checkJWTToken, 
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Update inventory processing
router.post(
  "/update",
  checkJWTToken, 
  invValidate.inventoryRules(),                
  invController.checkUpdateData,               
  utilities.handleErrors(invController.updateInventory)
)

/* ****************************************
 * DELETE ROUTES
 **************************************** */

// Build delete confirmation view
router.get(
  "/delete/:inv_id",
  checkJWTToken,  
  utilities.handleErrors(invController.buildDeleteConfirmation)
)

// Process inventory delete
router.post(
  "/delete",
  checkJWTToken, 
  utilities.handleErrors(invController.deleteInventoryItem)
)

// GET Account Update View
router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// POST Account Info Update
router.post(
  "/update",
  regValidate.accountUpdateRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// POST Password Change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router
