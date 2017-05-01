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
  runBamazon();
});

var runBamazon = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory",
      "Add to inventory", "Add New Product"]
  }).then(function(answer) {
    //run switch case scenario for running different functions based on user input
    switch (answer.action) {
      case "View Products for Sale":
        productList();
        break;

      case "View Low Inventory":
        inventory();
        break;

      case "Add to Inventory":
        addUnits();
        break;

      case "Add New Product":
        addProduct();
        break;
    }
  });
};

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
    runBamazon();
  });
};

//function listing all items with an inventory count lower than 5
var inventory = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res.stock_quantity < 5) {
        console.log(" | " + "Product ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Product Stock: " + res[i].stock_quantity + " | " + "Product Price: "+ res[i].price);
        console.log("_________________________________________________________________________________________");
      }
      else {
        console.log("There are no items with an inventory lower than 5");
      }
    }
    runBamazon();
  });
};

//function prompting the user to add more of any item currently in the store
var addUnits = function() {
  inquirer.prompt([
  {
    type: "input",
    message: "What is the name of the product you wish to add units of?",
    name: "name"
  },
  {
    type: "input",
    message: "How much of the product do you wish to add?",
    name: "stock",
    default: 0
  }
]).then(function(moreUnits){
  //inserting more units into a specific product by finding units of the product by its product name
  //then adding them to the original stock_quantity
    connection.query("INSERT INTO inventory SET ? WHERE product_name=?" , [moreUnits.name], {
      stock_quantity: res[0].stock_quantity + moreUnits.stock
      }, function(err, res){
      if (err) throw err;
      console.log(moreUnits.stock + "units added to " + res[0].product.name + "! There are now" + res[0].stock_quantity + "units of " + res[0].product_name + ".");
    });
    runBamazon();
  });
};



///allow the user to add a new item to the inventory
var addProduct = function() {
  inquirer.prompt([
  {
    type: "input",
    message: "What is the name of the new product you wish to add to our inventory?",
    name: "name"
  },
  {
    type: "input",
    message: "How much of the product do you wish to add?",
    name: "stock",
    default: 0
  },
  {
    type: "input",
    message: "What is the price of the product you wish to add?",
    name: "price",
    default: 0
  }
  ]).then(function(answers){
    connection.query("INSERT INTO products SET ?", {
        product_name: answers.name,
        stock_quantity: answers.stock,
        price: answers.price
      }, function(err, res){
        if (err) throw err;
        console.log("Item added!");
      });
      runBamazon();
    });
};
