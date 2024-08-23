import connectDB from '../src/db/db.js';
import dotenv from 'dotenv'
import { app } from "./App.js";
dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Mysql db connection failed !!! ", err);
})

