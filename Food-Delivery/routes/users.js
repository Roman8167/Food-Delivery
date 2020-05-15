const express = require("express");
const router =  express.Router();
router.use(express.urlencoded({extended:false}))
const mongoose = require("mongoose");
const session = require("express-session");
const bcryptjs = require("bcryptjs");
const passport = require('passport');
require("../auth/passport")(passport)
router.use(passport.initialize());
router.use(passport.session());
const UserSchema = require("../models/User-Login");
const url = "mongodb://localhost:27017/user-login-register";
//setup a connection
mongoose.connect(url,()=>{
    console.log(`Connected to User-login-register-table`)
});
router.get("/login",function(req,res){
    res.render("login.ejs")
});
router.get("/register",function(req,res){
    res.render("register.ejs")
});
router.post("/register",function(req,res){
    const errorMessage = [];
    const{name,email,password,password2} = req.body;
    if(!name||!email||!password||!password2){
        errorMessage.push({msg:"Please fill all the requirements"})
    }
    if(password!=password2){
        errorMessage.push({msg:"Passwords do not match"})
    }
    if(password.length<6){
        errorMessage.push({msg:"Password should be longer than 6 characters!"})
    }
    if(errorMessage.length>0){
        res.render("register.ejs",{
            errorMessage,
            name,
            email,
            password,
            password2
        })
    }
    else{
        UserSchema.findOne({email:email}).then(user=>{
            if(user){
                errorMessage.push({msg:"Email is already registerd"});
                res.render("register.ejs",{
                    errorMessage,
                    name,
                    email,
                    password,
                    password2
                });
                
            }
            else{
                const newUser = new UserSchema({
                    name:name,
                    email:email,
                    password:password
                });
                const saltRound = 10;
                bcryptjs.genSalt(saltRound,(err,salt)=>{
                    if(err) throw err;
                    bcryptjs.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(res.redirect("/login")).catch(err=>{
                            console.log(err)
                        })
                    })
                })
            }
        })
    }
});
//controlling the post handling request.
router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/homepage",
        failureRedirect:"/login"
    })(req,res,next)
})
module.exports = router