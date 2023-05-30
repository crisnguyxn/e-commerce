const User = require("../models/userModel")
const dotenv = require("dotenv").config()
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const { verifyToken } = require("../configs/jwtToken")

const authMiddleware = asyncHandler(async(req,res,next) => {
    const authorHeader = req?.headers?.authorization;
    if(authorHeader){
        const token = authorHeader.split(" ")[1];
        console.log(token,"token");
        try {
            const decoded = verifyToken(token)
            console.log(decoded,"decoded");
            req.user = decoded.id;
            console.log(req.user);
            next();
        } catch (error) {
            throw new Error("Not authorized token expired.Please login again");
        }
    }else{
        throw new Error("Token is not attached to header")
    }
})

const isAdmin = asyncHandler(async(req,res,next) => {
    const userId = req.user;
    const findUser = await User.findById(userId);
    if(findUser.role == "admin"){
        next();
    }else{
        throw new Error("You do not have permission to access this route")
    }
})

module.exports = {authMiddleware,isAdmin}