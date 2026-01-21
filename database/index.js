const { Pool } = require('pg');
require('dotenv').config();
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production enviroment
 * If - else will make determination which to use
 * *************** */
let pool;
if (process.env.NODE_ENV == 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // added for troubleshooting queries
    // during deveolpment
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log('executed query', { text });
                return res;
            } catch (error) {
                console.error('error in query', { text });
                throw error
            }
        }
    }
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool;
}

// explaination for code found here: https://byui-cse.github.io/cse340-ww-content/views/mvc-start.html