var mysql = require('mysql');
var inquirer = require('inquirer');
var stock;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port     : 8889,
  password : 'root',
  database : 'Bamazon'
});

connection.connect(function(err){
  if(err){
    throw err;
  }else {
    console.log("connected");
  }//end else
});//end connect()

//start shopping
shop();

function shop(){
   inquirer.prompt([
        {
          type: "list",
          message: "Do you want to shop with Bamazon",
          choices: ["yes", "no"],
          name: "shopper"
      }
      
    ]).then(function(user) {
      if(user.shopper === "yes"){
        productDisplay();
      }else{
        console.log("Sorry to hear that, see you next time");
      }
    });
}//end shop function

function productDisplay(){
  console.log("WELCOME TO THE BAMAZON, LETS SHOP TILL YOU DROP\nHere is what we have:");
connection.query('SELECT * from `products`', function(error, results, fields) {
   if(error){
    console.log(error);
  }else{
    //getting all products from the databse to show to user
    for (var i = 0; i < results.length; i++) {
      console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name
        + " | " + "$" + results[i].price);
    }//end for loop

    
  }//end else 
});

//timeout function to let shopper browse through products
    setTimeout(function(){
      purchase();
    },4000);

}//end function

function purchase(){
 connection.query('SELECT stock_quantity, price from products', function(error, results, fields) {
   if(error){
    console.log(error);
  }else{
  inquirer.prompt([
    {
      name: "id",
      type: "list",
      choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      message: "choose id of the product you would like to purchase"
    },
	    {
	        type: "input",
	        message: "How many units of this item would you like to purchase",
	        name: "units"
      }
    ]).then(function(user) {
    	stock = results[user.id - 1].stock_quantity;
      var total = user.units * results[user.id - 1].price;
    	//console.log(results[user.id - 1].product_name);
    	if(user.units > stock){
    		console.log("Sorry we do not have that many in stock\nWe have " + 
    			stock + " left of that item");
    	}else{
        connection.query("update products set stock_quantity = stock_quantity - ? where item_id = ?", [user.units, user.id, user.units, user.id], function(err, results){
          console.log(stock + " left");
          console.log("The price for this is $" + total);
          setTimeout(function(){
        console.log("Thank You for your purchase!");
      },3000);
        });
      }
      connection.end();
    });//end inquirer prompt

  }
  });
}//end function




