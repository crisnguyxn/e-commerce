const mongoose = require("mongoose")

const ImageSchema =  mongoose.Schema({
    img:{
        data:String,
        contentType:String
    }
})
const VideoSchema = mongoose.Schema({
    video:{
        data:String,
        contentType:String
    }
})

const productSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:Number,
    images:[ImageSchema],
    videos:[VideoSchema],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    color:{
        type:String,
        enum:["Black","Brown","Red"]
    },
    brand:{
        type:String,
        enum:["Apple","Samsung","Lenovo"]
    },
    ratings:[
        {
            star:Number,
            postedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        },
    ],
},{
    timestamps:true
})

module.exports = mongoose.model('Product',productSchema)