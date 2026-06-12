import pool from '../db/connection.js';

export const getUuidByAuth0Id = async (auth0Id) => {
    try {
        const result = await pool.query(
            `SELECT user_id FROM profiles WHERE auth0_id = $1`, 
            [auth0Id]
        );

        if (result.rows.length > 0) {
            return result.rows[0].user_id; 
        }

        const insertResult = await pool.query(
            `INSERT INTO profiles (auth0_id) VALUES ($1) RETURNING user_id`,
            [auth0Id]
        );
        
        return insertResult.rows[0].user_id;
    } catch (error) {
        console.error("getUuidByAuth0Id fail:", error);
        throw error;
    }
}