const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/food";
const foodStructures = require("./foodStructure");
mongoose.connect(url,()=>{
    console.log("Connected to the food-table")
});
const food = [new foodStructures({
    imagePath:"https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-beef-burger-with-fries-and-mustard-sauce-set-meal-jacek-malipan.jpg",
    productName:"Beef Burger with Fries and Mustard Sauce Set Meal",
    description:"The Best Classic Burger Recipe – Perfectly seasoned juicy homemade hamburgers.  This easy recipe only needs a few ingredients",
    price:15
}),
new foodStructures({
    imagePath:"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/healthy-recipes-marquee-1577978180.png?crop=0.881xw:0.664xh;0.0849xw,0.122xh&resize=980:*",
    productName:"Healthy Lunch Package",
    description:"Mix up your midday meal routine with one of these crazy delicious soup, sandwich, and pasta recipes",
    price:12
}),
new foodStructures({
    imagePath:"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/spring-salads-spring-carrot-salad-recipe-1580519240.png?crop=0.9984732824427481xw:1xh;center,top&resize=980:*",
    productName:"Shaved Carrot and Radish Salad",
    description:"The carrot ribbons and thinly sliced radishes in this recipe are an amazing and unexpected substitute.",
    price:7
}),
new foodStructures({
    imagePath:"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/healthy-recipes-marquee-1577978180.png?crop=0.881xw:0.664xh;0.0849xw,0.122xh&resize=980:*",
    productName:"Steak Chimichurri",
    description:"Chimichurri is a classic Argentinian sauce or marinade that turns everything it touches into flavor gold — seriously.",
    price:32
}),
new foodStructures({
    imagePath:"https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/greek-salad-recipe-1585594791.jpg?crop=1.00xw:0.669xh;0,0.160xh&resize=980:*",
    productName:"Greek Salad",
    description:"Flavorful capers give this go-to Mediterranean dish a serious boost of flavor, while a pinch of confectioners’ sugar balances the tartness for the perfect zesty bite.",
    price:9
}),
];
var done = 0;
for(var i=0;i<food.length;i++){
    food[i].save(function(err,result){
        if(err) throw err;
        if(done==food.length){
            exit()
        }
    })
}
function exit(){
    mongoose.disconnect(url)
}