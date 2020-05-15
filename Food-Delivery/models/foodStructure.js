const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foodTables = new Schema({
    imagePath:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    
});
module.exports = mongoose.model("food-packages",foodTables)