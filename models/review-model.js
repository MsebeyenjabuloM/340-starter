const pool = require("../database/")

/* ***************************
 *  Add a Review
 *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO reviews (review_text, inv_id, account_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    return await pool.query(sql, [review_text, inv_id, account_id]);
  } catch (error) {
    console.error("addReview error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get Reviews by Inventory ID
 *************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.*, 
             CONCAT(LEFT(a.account_firstname, 1), a.account_lastname) AS screen_name
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `;
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get Reviews by Account ID
 *************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, 
             i.inv_make, 
             i.inv_model
      FROM reviews r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC;
    `;
    return await pool.query(sql, [account_id]);
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get a Single Review by ID
 *************************** */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT * FROM reviews WHERE review_id = $1`;
    return await pool.query(sql, [review_id]);
  } catch (error) {
    console.error("getReviewById error: " + error);
    throw error;
  }
}

/* ***************************
 *  Update Review
 *************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = `
      UPDATE reviews
      SET review_text = $1
      WHERE review_id = $2
      RETURNING *;
    `;
    return await pool.query(sql, [review_text, review_id]);
  } catch (error) {
    console.error("updateReview error: " + error);
    throw error;
  }
}

/* ***************************
 *  Delete Review
 *************************** */
async function deleteReview(review_id) {
  try {
    const sql = `
      DELETE FROM reviews
      WHERE review_id = $1;
    `;
    return await pool.query(sql, [review_id]);
  } catch (error) {
    console.error("deleteReview error: " + error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview
};
