import mysql from "mysql2/promise"


const connectDB = async () => {
    try {
       const connectionInstance = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DBNAME
        })
        console.log("\n Mysql connected !! DB HOST");

    } catch (error) {
        console.log("Mysql connection FAILED ", error);
    }
}



export  default connectDB