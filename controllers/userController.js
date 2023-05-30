const { generateToken, generateRefreshToken, verifyToken } = require("../configs/jwtToken");
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler');
const validateMongoId = require("../utils/validateMongoId");
const jwt = require('jsonwebtoken');
const { sendMail } = require("./emailController");
const crypto = require('node:crypto')
const dotenv = require('dotenv').config()
//register
const registerUser = asyncHandler(async (req,res) => {
    const {email} = req.body;
    const findUser = await User.findOne({email})
    if(!findUser){
        const newUser = await User.create(req.body)
        res.json(newUser)
    }else{
        throw new Error("User already existed")
    }
})
//login
const loginUser = asyncHandler(async (req,res) => {
    const {email, password} = req.body
    const findUser = await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password)){
        
        const refreshToken = generateRefreshToken(findUser._id);
        const updatedUser = await User.findByIdAndUpdate(findUser.id,{refreshToken:refreshToken},{new:true})
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
        res.json({
            id:findUser?.id,
            token:generateToken(findUser?.id)
        })
    }else{
        throw new Error("Invalid credentials")
    }
})

//logout

const logoutUser = asyncHandler(async (req,res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("RefreshToken is not in your cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken},{refreshToken:""},{new:true});
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204)  
})

//handle reset password

const resetPasswordToken = asyncHandler(async(req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user) throw new Error("User with this email is not existed")
    try {
        const token = await user.createPasswordResetToken()
        await user.save();
        const resetURL = 
        `Hi please follow this link to reset password.Expired time:10 mins from now.<a href="http://localhost:5000/api/user/reset-password/${token}""`; 
        const data = {
            to:user.email,
            subject:"reset password",
            text:user.firstName,
            htm:resetURL
        }
        sendMail(data);
        console.log(data);
        res.json(token);
    } catch (error) {
        throw new Error(error)
    }
})

//handle reset password 
const resetPassword = asyncHandler(async(req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpired: {$gt:Date.now()}
    })
    if(!user) throw new Error("Token expired,Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save();
    res.json(user)
})

//handle refresh token

const handleRefreshToken = asyncHandler(async(req,res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("RefreshToken is not in your cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error("The refreshToken is not present or is not valid");
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) =>{
        if(err || user._id != decoded.id){
            throw new Error("Something wrong with this refreshToken")
        }
        const accessToken = generateToken(decoded.id);
        res.json(accessToken)
    })
})

//get all users

const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find();
    res.json({
        users,
        length:users.length
    })
})

//get user

const getUser = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoId(id)
    try {
        const findUser = await User.findById(id)
        res.json({user:findUser})
    } catch (error) {
        throw new Error(error)
    }
})

//update user

const updateUser = asyncHandler(async (req,res) => {
    const originalId = req.user;
    const {id} = req.params
    validateMongoId(id)
    try {
        if(originalId == id){
            const updateUser = await User.findByIdAndUpdate(id,req.body,{runValidators:true, new:true})
            res.json({updateUser})
        }else{
            throw new Error("You do not have permission to access this route")
        }
    } catch (error) {
        throw new Error(error)
    }
})

//delete user

const deleteUser = asyncHandler(async (req,res) => {
    const originalId = req.user;
    const {id} = req.params
    validateMongoId(id)
    try {
        if(originalId == id){
            const deletedUser = await User.findByIdAndDelete(id,req.body,{runValidators:true, new:true,})
            res.json({deletedUser})
        }else{
            throw new Error("You do not have permission to access this route")
        }
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = {
    registerUser,loginUser,getAllUsers,getUser,updateUser,deleteUser,handleRefreshToken,logoutUser,resetPasswordToken,resetPassword
}