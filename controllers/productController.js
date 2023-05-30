const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const validateMongoId = require("../utils/validateMongoId");


const createProduct = asyncHandler(async(req,res) => {
    const userId = req.user;
    const product = await Product.create(Object.assign(req.body,{
        userId:userId
    }))
    res.json(product)
})

const getAllProductsByUserId = asyncHandler(async(req,res) => {
    const {userId} = req.params;
    validateMongoId(userId)
    try {
        const products = await Product.find({userId});
        res.json({
            products,
            length:products.length
        })   
    } catch (error) {
        throw new Error(error)
    }
})

const getAllProducts = asyncHandler(async(req,res) => {
    try {
        // Filtering
        const queryObj = {...req.query};
        const ignoreFields = ['page','sort','limit','fields']
        ignoreFields.forEach(element => {
            delete queryObj[element]
        });
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))

        //sort

        if(req.query.sort){
            const sortArr = req.query.sort.split(",").join(" ");
            query = query.sort(sortArr)
        }else{
            query = query.sort("-createdAt")
        }

        //fields

        if(req.query.fields){
            const fieldArr = req.query.fields.split(",").join(" ");
            query = query.select(fieldArr)
        }else{
            query = query.select("-__v")
        }
    
        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1)*limit;
        query = query.skip(skip).limit(limit)

        if(req.query.page){
            const productCount = await Product.countDocuments()
            if(skip >= productCount) throw new Error("This Page does not exists")
        }
    
        const products = await query;
        res.json({
            products,
            length:products.length
        })
      } catch (error) {
        throw new Error(error);
      }
})

const getProduct = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoId(id)
    try {
        const product = await Product.findById({id});
        res.json({product})   
    } catch (error) {
        throw new Error("Product is not existed with this id"+id)
    }
})

const updateProduct = asyncHandler(async(req,res) => {
    const userId = req.user;
    const {id} = req.params;
    validateMongoId(id)
    const product = await Product.findById(id);
    if(userId == product.userId){
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
            res.json({updatedProduct})   
        } catch (error) {
            throw new Error("Product is not existed with this id"+id)
        }
    }
})

const deleteProduct = asyncHandler(async(req,res) => {
    const userId = req.user;
    const {id} = req.params;
    validateMongoId(id)
    const product = await Product.findById(id);
    if(userId == product.userId){
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            res.json({deletedProduct})   
        } catch (error) {
            throw new Error("Product is not existed with this id"+id)
        }
    }
})

module.exports = {createProduct,getAllProductsByUserId,getAllProducts,getProduct,updateProduct,deleteProduct}