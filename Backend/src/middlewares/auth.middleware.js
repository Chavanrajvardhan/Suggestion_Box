import asyncHandler from "../utils/asyncHander.js";
import connectDB from '../db/db.js'
import  jwt  from "jsonwebtoken";


const verifyJwt = asyncHandler(async (req, res, next) => {
    const db = await connectDB()

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token){
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Unauthorised request"
            })
        }

        const  decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const [rows] = await db.query(
            "SELECT * FROM users WHERE id = ?",[decodedToken?.id]
        )

        const user = rows[0];

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid AccessToken"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message: "Invalid asscess token"
        })
    }
})


export default verifyJwt