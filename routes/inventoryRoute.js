// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route for vehicle detail page
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView))

// Route to intentionally trigger a 500 error
router.get("/error500", utilities.handleErrors(async (req, res, next) => {
  // Throw an intentional error
  throw new Error("This is a test 500 error triggered from footer link");
}));


module.exports = router
