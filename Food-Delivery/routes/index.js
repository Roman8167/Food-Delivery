const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongodb = require("mongodb").MongoClient;
const morgan = require("morgan");
const urlencoded = bodyParser.urlencoded({extended:false})
const mongoose = require("mongoose");
const userLogin = require("../models/User-Login")
const foodStructure = require("../models/foodStructure");
const customers = require("../models/customers")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const url2 = "mongodb://localhost:27017/customers"

//connecting with the customerDetails
mongoose.connect(url2,function(){
    console.log("Connected to the customer tables")
})
router.use(bodyParser.json());

///making a session table
router.use(session({
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:180*60*1000},
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));
const url = "mongodb://localhost:27017/food";
///creating a connection with mongoose
mongoose.connect(url,()=>{
    console.log("Connected to the food-table")
});
router.use(morgan("dev"));
router.use(cookieParser());

//creating a global variable
router.use(function(req,res,next){
    res.locals.session = req.session;
    next()
});
///checkout route
router.get("/checkout",function(req,res){
    ///calculating the totalPrice;
    ///as i did not assigned the variables like totalPrice and the totalQty globally i had to loop through every route to get the totalQty and the totalPrice
    var productName = ''
    //loop
    cart.forEach(function(cart,cartIndex,cartArray){
        productName+=cart.productName
    })
    var finalTotalPrice = 0;
    var finalTotalQty = 0;
    cart.forEach(function(cartItem,cartIndex,cartArray){
        finalTotalPrice+=cartItem.price
    });
    cart.forEach(function(cartItem,cartIndex,cartArray){
        finalTotalQty+=cartItem.qty
    })
    res.render("checkout.ejs",{foods:cart,totalPrice:finalTotalPrice,totalQty:finalTotalQty,productName:productName})
})
///checkout post Route

///homepage routes
router.post("/checkout",urlencoded,function(req,res){
    const errors = [];
    const{name,email,address,telephone,city,product,subtotal,totalQuantity} = req.body;
    if(!name||!email||!address||!telephone||!city||!product||!subtotal||!totalQuantity){
        errors.push({error:"Please fill all the forms!"})
    }
    if(!product && !subtotal && !totalQuantity){
        errors.push({error:"Items are not inserted in the cart"})
    }
    if(subtotal==0||totalQuantity==0||!product){
        errors.push({error:"Error! There are no data inserted in the cart"})
    }
    if(errors.length>0){
        res.render("checkout.ejs",{
            errors,
            name,
            email,
            address,
            telephone,
            city,
            product,
            subtotal,
            totalQuantity
        })
    }
    else{
       mongodb.connect(url,function(err,db){
           var dbo = db.db("food");
           dbo.collection("user-login-registers").findOne({email:email,name:name}).then(user=>{
               if(!user){
                   res.status(404).send("The Email You've entered is not registered in our platform!")
               }
               else{
                const newCustomers = new customers({
                    name:req.body.name,
                    email:req.body.email,
                    address:req.body.address,
                    telephone:req.body.telephone,
                    city:req.body.city,
                    product:req.body.product,
                    subtotal:req.body.subtotal,
                    totalQuantity:req.body.totalQuantity
                });
                
                newCustomers.save().then(res.redirect("/homepage")).catch((err)=>{
                    console.log(err)
                })
               }
           }).catch((err)=>{
               console.log(err)
           })
       })
    }
    
    
})


router.get("/homepage",function(req,res,next){
    
    foodStructure.find({},function(err,food){
        if(err){
            throw err
        }
        else{
            var totalQtyzz = 0;
            
            cart.forEach(function(cart,cartIndex,cartArray){
                totalQtyzz+=cart.qty
            });
           
            res.render("homepage.ejs",{food:food,totalQty:totalQtyzz,message:""})
        }
        
    });
    
});
//adding products to the cart which helps alot
///for this method i used the new Set method in order to remove the duplicates in the array
//for example if the names are the same i don't want another list of items so i used the new Set to remove the duplicates
//for 
var cart = new Set()
var qty = 0;
var price = 0;
var totalQty = 0
var totalPrice = 0;

//adding the product to the cart
router.get("/add-to-cart/:id",function(req,res){
    var productId = req.params.id;
    foodStructure.findById(productId,function(err,food){
        var foodItem = cart[food];
        if(!foodItem){
            foodItem= cart[food] = {_id:food._id,productName:food.productName,qty:0,price:0,totalPrice:0,totalQty:0};

        }
        cart[food].qty++;
        cart[food].price=food.price * cart[food].qty;
        cart[food].totalPrice+=food.price
        cart[food].totalQty+=1
        
        
        req.session.cart = cart[food]
        ///pushed the cart into the array
        cart.add(req.session.cart)
       ///calculating the totalPrice of the cart by using a simple algorithm.
       //firstly we loop the products and then create a new variable lets say  var total = 0;
       ///then we loop it and then add the total to the number of price
       //which will return the sum of the array elements
       var total = 0;
        cart.forEach(function(item,index,array){
            total+=item.price
        })
        ///calculating the totalQuantity by using the same algorithm that i used in the above 
        var totalQty = 0;
        cart.forEach(function(item,index,array){
            totalQty+=item.qty;
            
        })

        
        
       
        res.render("cart.ejs",{foods:cart,totalPrice:total,totalQty:totalQty});
        
        console.log(req.session.cart)
    });
    
});
////deleting the cart routes
///i made a new set so that when products are entered it won't interfere with the oldCart
router.get("/deleteAll",function(req,res){
    cart = new Set()
    res.render("cart.ejs",{foods:null,totalPrice:null,totalQty:null,price:null,qty:null,productName:null})
});





//update routes
/////updating the quantity of the cart
router.get("/reduce/:id",function(req,res){
    var productID = req.params.id;
    foodStructure.findById(productID,function(err,food){
        if(err) throw err;
        var foodItems = cart[food];
        if(!foodItems){
            foodItems = cart[food] = {_id:food._id,productName:food.productName,price:0,qty:0,totalPrice:0,totalQty:0}
        }
    
    
        cart[food].qty--;
        cart[food].price = food.price * cart[food].qty;
        var totalQty3 = 0;
        var totalPrice3 = 0;
        cart.forEach(function(cart,cartindex,cartArray){
            totalPrice3-=cart.price;
            
        });
        cart.forEach(function(cart,cartIndex,cartArray){
            totalQty3-=cart.qty;
            
        });
        //deleting the individual cart if the totalPrice or the totalQty hits zero

        cart.forEach(function(cartItems,cartIndex,cartArray){
            if(cart[food].price<=0||cart[food].totalPrice<=0){
                cart.delete(cart[food]);
                
                
                
            }
        })
        
        ///for the Math.abs() i returned an absolute value for that.
        res.render("cart.ejs",{foods:cart,totalPrice:Math.abs(totalPrice3),totalQty:Math.abs(totalQty3)})
    })  
});
///increasing the quantity of the cart individually;
router.get("/increase/:id",function(req,res){
    var productID = req.params.id;
    foodStructure.findById(productID,function(err,food){
        var foodItem = cart[food];
        if(!foodItem){
            foodItem = cart[food] = {_id:food._id,productName:food.productName,price:0,qty:0,totalPrice:0,totalQty:0}
        }
        cart[food].qty++;
        cart[food].price = food.price * cart[food].qty
        var totalPrice4 = 0;
        var totalQty4 = 0;
        ////calculating the totalPrice and so on
        cart.forEach(function(cart,cartIndex,cartIndex){
            totalPrice4+=cart.price
        });
        cart.forEach(function(cart,cartIndex,cartArray){
            totalQty4+=cart.qty
        })
        res.render("cart.ejs",{foods:cart,totalPrice:totalPrice4,totalQty:totalQty4})
    })
});

module.exports = router;


