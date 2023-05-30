const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const generateRefreshToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'3d'})
}

const verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET)
}

module.exports = {generateToken,verifyToken,generateRefreshToken}