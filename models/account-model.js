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

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


module.exports = { registerAccount, getAccountByEmail }
