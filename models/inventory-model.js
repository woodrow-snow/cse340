const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error('getclassificaitonsbyid error' + error)
    }
}

/* ***************************
 *  Get all information on 1 specific vehicle
 * ************************** */
async function getVehicleDetailsById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        );
        return data.rows[0];
    } catch (error){
        console.error('getvehicledetailsbyid error' + error);
    }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classificaiton_name) {
    try {
        const sql = 'INSERT INTO classification (classification_name, classification_id) VALUES ($1, DEFAULT) RETURNING *';
        return await pool.query(sql, [classificaiton_name]);
    } catch (error){
        return error.message;
    }
}


module.exports = { getClassifications, getInventoryByClassificationId, getVehicleDetailsById, addClassification };