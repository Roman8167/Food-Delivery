const express = require("express");
const router = express.Router();
const customer = require("../models/customers")
const bodyParser = require("body-parser");
const mongodb = require("mongodb").MongoClient
const url = "mongodb://localhost:27017/admin";
const urlencoded = bodyParser.urlencoded({extended:false});
var cart = []
//connect routes
router.get("/",function(req,res){
    res.render("welcome.ejs")
});
router.get("/admin",function(req,res){
    res.render("admin.ejs")
});
//matching passwords and emails so that normal people cannot access in the admin Page
router.post("/admin",urlencoded,function(req,res){
    const{email,password} = req.body;
    const errors = [];
    if(!email||!password){
        errors.push({msg:"Please enter all the fields"});
    }
    if(!email){
        errors.push({msg:"Email is required!"})
    }
    if(!password){
        errors.push({msg:"Password is required"})
    }
    if(errors.length>0){
        res.render("admin.ejs",{
            errors,
            email,
            password
        })
    }
    mongodb.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("admin");
        dbo.collection("admins").findOne({email:email,password:password}).then(user=>{
            if(!user){
                res.status(404).send(`Error ${404}`)
            }
            else{
                res.redirect("/adminPage")
            }
        }).catch((err)=>{
            console.log(err)
        })
    })
});
////outputting the customer orders;
router.get("/adminPage",function(req,res){
    customer.find({},function(err,resullt){
        
        res.render("adminPage.ejs",{foods:resullt})
    })
});
router.get("/adminpage/:id",function(req,res){
    var productID = req.params.id;
    customer.findByIdAndDelete(productID,function(err,result){
        if(err) throw err;
        
    }).then(res.redirect("/adminpage")).catch((err)=>{
        console.log(err)
    })
})
module.exports = router