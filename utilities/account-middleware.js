// utilities/account-middleware.js
const jwt = require("jsonwebtoken")

/* ****************************************
 *  Authorization Middleware for Inventory/Admin
 **************************************** */
function checkJWTToken(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) {
      req.flash("error", "You must log in to access this page.")
      return res.redirect("/account/login")
    }

    // use same secret used when creating token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    // Only allow Employee or Admin
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded
      return next()
    } else {
      req.flash("error", "You do not have permission to access this page.")
      return res.redirect("/account/login")
    }
  } catch (error) {
    console.error("JWT authorization error:", error)
    req.flash("error", "Authentication failed. Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkJWTToken }
