const mongoose = require("mongoose");
const adminAuth = require("../models/adminAuth")
const url = "mongodb://localhost:27017/admin";
mongoose.connect(url,()=>{
    console.log("Connected to the admin database");
    
});
const newadminAuth = [new adminAuth({
    adminEmail:"johndoe@gmail.com",
    adminPassword:"johndoe123"
})];
var done = 0;
for(var i=0;i<newadminAuth.length;i++){
    newadminAuth[i].save(function(err,result){
        if(err) throw err;
        if(done==newadminAuth.length){
            exitMongo()
        }
    })
}
function exitMongo(){
    mongoose.disconnect()
}
