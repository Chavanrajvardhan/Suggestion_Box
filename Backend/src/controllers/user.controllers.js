import asyncHandler from "../utils/asyncHander.js";
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js'
import connectDB from "../db/db.js";




const generateAccessTokenAndRefreshToken = async (user_id) => {

    try {

        const db = await connectDB()
        const [rows] = await db.query(
            "SELECT * FROM users WHERE id = ?", [user_id]
        );

        const user = rows[0];
        if (!user) {
            return null
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)


        await db.query(
            "UPDATE users SET refreshToken = ? WHERE id = ?",
            [refreshToken, user.id]
        );

        return { accessToken, refreshToken };

    } catch (error) {
        console.log(error)
    }

}
const registerUser = asyncHandler(async (req, res) => {
 
    const db = await connectDB()

    const { username, fullname, email, password } = req.body;

    if ([username, fullname, email, password].some((field) => field.trim() === '')) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }

    const [existedUser] = await db.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email]
    )
    // console.log(existedUser[0])
    if (existedUser.length > 0) {
        return res.status(400).json({
            success: false,
            message: "User with email or username already exists"
        })
    }


    const [user] = await db.query(
        "INSERT INTO users (fullname, email, username, password) values(?, ?, ?, ?)",
        [fullname, email, username, password]
    );
    
    if (!user) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while registering the user"
        })
    }

    return res.status(200).json({
        status: 200,
        success: true,
        data: {
            username,
            fullname,
            email
        },
        message: "User registerd Successfully"
    })

})


const loginUser = asyncHandler(async (req, res) => {

    const db = await connectDB()

    const {email, password } = req.body
    console.log(email,password)
    
    if (!(password && email)) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid credential"
        })
    }

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? AND password = ? ",
        [email, password]
    )

    const user = rows[0]

    if(!user){
        console.log("wrong ")
        return res.status(400).json({
            status:400,
            success: false,
            message: "Invalid credentials"
        })
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user.id);


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken,options)
        .json({
            status: 200,
            success: true,
            data: {
                refreshToken, accessToken
            },
            message: "user logged in Successfully"
        })
})

const logoutUser = asyncHandler(async (req, res) => {
    const db = await connectDB()

    const userId = req.user.id;

    const [rows] = await db.query(
        "UPDATE users SET refreshToken = NULL WHERE id = ?",
        [userId]
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            status: 200,
            success: true,
            message: "User Logged out successfully"
        })


})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        status: 200,
        data: req.user,
        message: "user fetched successfully"
    })
})



export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}