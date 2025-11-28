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
      hashedPassword
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

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, first_name, last_name,
              email, account_type
       FROM account
       WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
* Update account info (first_name, last_name, email)
* ***************************** */
async function updateAccountInfo(account_id, first_name, last_name, email) {
  try {
    const sql = `
      UPDATE account
      SET first_name = $1,
          last_name = $2,
          email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const result = await pool.query(sql, [first_name, last_name, email, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccountInfo error:", error)
    return null
  }
}

/* *****************************
* Update account password (hashed)
* ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updatePassword error:", error)
    return null
  }
}

module.exports = { 
  registerAccount, 
  getAccountByEmail, 
  getAccountById, 
  updateAccountInfo, 
  updatePassword 
}

