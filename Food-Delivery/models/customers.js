const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    telephone:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true,

    },
    product:{
        type:String,
        required:true,

    },
    subtotal:{
        type:Number,
        required:true
    },
    totalQuantity:{
        type:Number,
        required:true
    },
    
});
module.exports = mongoose.model("customerOrders",userSchema)