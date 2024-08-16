import { app } from "./src/App.js";
import dotenv from "dotenv"


dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    app.listen(process.env.port || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})