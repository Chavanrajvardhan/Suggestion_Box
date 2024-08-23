import mysql from "mysql2/promise";

let pool;

const connectDB = async () => {
    if (!pool) {
        try {
            pool = mysql.createPool({
                host: process.env.HOST,
                user: process.env.USER,
                password: process.env.PASSWORD, // Make sure this is uncommented for production
                database: process.env.DBNAME,
                waitForConnections: true,
                connectionLimit: 10, // Adjust as necessary
                queueLimit: 0 // No limit on queued requests
            });

            await pool.getConnection(); // Attempt to verify connection
            console.log("\nMySQL connection pool created!");

        } catch (error) {
            console.error("MySQL connection FAILED", error);
            throw error; // Ensure errors are propagated
        }
    }
    return pool;
};

export default connectDB;
