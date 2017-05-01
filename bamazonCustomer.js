// npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection to the mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});
console.log("***Welcome to Bamazon!***");
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  productList();
  runBamazon();
});

//function displaying all available products
var productList = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);
    for (var i = 0; i < res.length; i++){
      //this top console.log includes all data from the table products
      // console.log(" | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      //this lower console.log only includes item id, name, & price
      console.log(" | " + "Product ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Product Price: "+ res[i].price);
      console.log("__________________________________________________________________");
    }
  });
};

function productQuant(answer, newUnits) {
  connection.query("UPDATE products SET stock_quantity=? WHERE item_id=\"?\"", [newUnits, answer.itemId], function(err, res) {
      if (err) throw err;
      console.log("Units added!");
      runBamazon();
  });
};

//function to determine user choice, what item they want to purchase & how much, then act on that choice
var runBamazon = function() {
  //inquirer to get user input
  inquirer.prompt([
    {
    type: "input",
    message: "What is the item_id of the product you wish to purchase?",
    name: "itemId",
    default: 00
  },
  {
    type: "input",
    message: "How many units do you wish to purchase?",
    name: "units",
    default: 0
  }
  ]).then(function(answer){
    //second attempt to update the table with the new product quantities

    //taking user input, comparing it to table info & either selling product or telling
    //user they are requesting too many & then running inquirer again
    connection.query("SELECT * FROM products WHERE item_id=?", [answer.itemId], function(err, res) {
      if (err) throw err;
      //for all products
      for (var i = 0; i < res.length; i++) {
        //then for any product in the list of all products that shares the same item_id as answer.itemId
        if (answer.itemId === res[i].item_id) {
          //if the units of the answer.units are less than or equal to the units recorded in the table
          if (answer.units <= res[i].stock_quantity) {
            //console.log those specific products
            var totalPrice = answer.units * res[i].price;
            var newUnits = res[i].stock_quantity - answer.units;
            productQuant(answer, newUnits);
            console.log("You just bought " + answer.units + " " + res[i].product_name + "!" + " That cost you $" + totalPrice + ".");
            console.log("There are now " + res[i].stock_quantity + " " + res[i].product_name + ".");
            runBamazon();
          }
          else {
            console.log("You can't buy that many, theres not enough " + res[i].product_name + "!");
            runBamazon();
          }
        }
      }
    });
  });
};
