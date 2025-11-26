const pool = require("../database/")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(first_name, last_name, email, hashedPassword) {
  try {
    const sql = `
      INSERT INTO public.account
        (first_name, last_name, email, password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [
      first_name,
      last_name,
      email,
      hashedPassword   // THE HASH
    ])
    return result
  } catch (error) {
    console.error("registerAccount error: ", error)
    return false
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, first_name, last_name,
              email, account_type, password
       FROM account
       WHERE email = $1`,
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}



module.exports = { registerAccount, getAccountByEmail }
