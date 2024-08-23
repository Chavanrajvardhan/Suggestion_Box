import jwt from 'jsonwebtoken'

function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            userName: user.userName,
            fullName: user.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

function generateRefreshToken (user) {
    return jwt.sign(
        {
            _id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

export {
    generateAccessToken,
    generateRefreshToken
}