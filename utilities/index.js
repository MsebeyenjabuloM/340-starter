const invModel = require("../models/inventory-model")
const Util = {}

/* Build the dynamic nav bar */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="main-nav">'  

  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`
  })
  list += '</ul>'
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let gridHTML = ""

  if (data.length > 0) {
    gridHTML = '<div class="vehicle-grid">' // container for the cards

    data.forEach(vehicle => {
      const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)

      gridHTML += `
        <div class="vehicle-card">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
          </a>
          <p class="price">${price}</p>
        </div>
      `
    })

    gridHTML += '</div>'
  } else {
    gridHTML = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return gridHTML
}

/* ****************************************
 * Build HTML for a single vehicle detail
 **************************************** */
Util.buildVehicleDetailHTML = (vehicle) => {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
  const mileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  return `
    <div class="vehicle-detail-card">
      <div class="vehicle-detail-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>

      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p class="price">${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
 * Build the classification <select> list
 ************************************** */
Util.buildClassificationList = async function (selectedId = null) {
  let data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classification_id" required>'
  list += '<option value="">Choose a Classification</option>'

  data.rows.forEach(row => {
    const selected = row.classification_id == selectedId ? "selected" : ""
    list += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}



module.exports = Util
