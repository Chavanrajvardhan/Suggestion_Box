import asyncHandler from "../utils/asyncHander.js";
import {generateAccessToken, generateRefreshToken} from '../utils/tokens.js'
import connectDB from "../db/db.js";




const generateAccessTokenAndRefreshToken = async (user_id) => {

   try {

     const db = await connectDB()
     console.log(user_id)
     const [rows] = await db.query(
         "SELECT * FROM users WHERE id = ?", [user_id]
     );
     
     const user = rows[0];
     console.log(user)
     if(!user){  
            return null
        }

     const accessToken = generateAccessToken(user)
     const refereshToken = generateRefreshToken(user)

     
     await db.query(
         "UPDATE users SET refereshToken = ? WHERE id = ?",
         [refereshToken,user.id]
     );
     
     console.log("Tokens Generated and Saved:", { accessToken, refereshToken });
     return {accessToken, refereshToken};

   } catch (error) {
        console.log(error)
   }

}
const registerUser = asyncHandler(async (req,res) => {
    //get user data from frontend
    //validate user data 
    //check user alredy existed or not 
    //save user data in db
    //if user not exist throw error
    //send json respone 

    const db = await connectDB()

    const {username, fullname, email, password} = req.body;

    if([username, fullname, email, password].some((field) => field.trim() === '')){
       return res.status(400).json({
        success:false,
        message: "All fields are required",
       })
    }

    const [existedUser] = await db.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, email]
    )

    if(existedUser.length > 0){
        return res.status(409).json({
            success: false,
            message:"User with email or username already exists"
        })
    }


    const [user] = await db.query(
        "INSERT INTO users (fullname, email, username, password) values(?, ?, ?, ?)",
        [fullname, email, username, password]
    );

    if(!user){
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while registering the user"
        })
    }

    return res.status(201).json({
        status : 201,
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
    //get username and email from frontend
    //if not get throw error msg
    //query to database this user exist or not 
    //if not throe error 
    //if validate give them access or refresh token
    
    const db = await connectDB()

    const {username, email, password} = req.body
  
    if(!(username || email)){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Invalid credential"
        })
    }

    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ? OR password = ? ",
        [username, password]
    )
    

    const user = rows[0];
 
    if(!user){
        return res.status(500).json({
            statusCode: 500,
            success:false,
            message: "user with this email or username not exist"
        })
    }

    if((user.password ==! password)){
        return res.status(401).json({
            statusCode: 401,
            success:false,
            message: "Incorrect Password"
        })
    }

    
    const {accessToken, refereshToken} = await generateAccessTokenAndRefreshToken(user.id);
  


    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken ,options )
    .cookie("refereshToken",refereshToken , options)
    .json({
        status : 200,
        success: true,
        data: {
            refereshToken,accessToken
        },
        message: "user logged in Successfully"
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    const db = await connectDB()

    const userId = req.user.id;

    const [rows] = await db.query(
        "UPDATE users SET refereshToken = NULL WHERE id = ?",
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


// const getCurrentUser = asyncHandler(async (req, res) => {

// })



export{
    registerUser,
    loginUser,
    logoutUser
}