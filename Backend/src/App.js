import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import logger from "./logger.js";
import morgan from "morgan";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

const morganFormat = ":method :url :status :response-time ms";


app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );


import userRouter from "./routes/user.route.js"
import postsRouter from "./routes/post.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postsRouter)

export {app}