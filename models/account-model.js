const pool = require("../database/")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(first_name, last_name, email, password) {
  try {
    const sql = `INSERT INTO public.account
      (first_name, last_name, email, password, account_type)
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
    const result = await pool.query(sql, [first_name, last_name, email, password])
    return result // return the inserted row
  } catch (error) {
    console.error("registerAccount error: ", error)
    return false
  }
}

module.exports = { registerAccount }
