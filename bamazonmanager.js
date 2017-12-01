var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table-redemption");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  start();

});

function start(){
  inquirer
    .prompt([
      {
      type: "list",
      message: "What would you like to do?",
      name: "mgrcommand",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory",
    "Add New Product"]
      }
    ])
    .then(function(command){
      switch (command.mgrcommand) {
        case "View Products for Sale":
            printTable();

            break;

        case "View Low Inventory":
        lowInventory();
            break;

        case "Add to Inventory":
        updateInventory();
            break;

        case "Add New Product":
        addNewProduct();
            break;
      }
    });
}


function printTable() {
  connection.query("SELECT * FROM products", function(error, results, fields) {
    var table = new Table({
      head: ['ID', 'ITEM', 'DEPARTMENT', 'PRICE', 'QUANTITY'],
      colWidths: [5, 30, 20, 10, 10]
    });

    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
      );
    }
    console.log(table.toString());
    start();
  });
}

function lowInventory () {
  connection.query("SELECT * FROM products WHERE stock_quantity<20", function(error, results, f) {
    var table = new Table({
      head: ['ID', 'ITEM', 'DEPARTMENT', 'PRICE', 'QUANTITY'],
      colWidths: [5, 30, 20, 10, 10]
    });

    for (var i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
      );
    }
    console.log(table.toString());
    start();

  });
}

function updateInventory() {


  inquirer
    .prompt([{
        name: "idinput",
        type: "input",
        message: "Please type in the ID of the product you'd like to update.",
        filter: function(input) {
          return parseFloat(input);
        },
        validate: function(input) {
          if (isNaN(input)) {
            return "Please type a number!";
          }

          return true;
        }

      },
      {
        name: "quantity",
        type: "input",
        message: "How many units would you like to add?",
        filter: function(input) {
          return parseFloat(input);
        },
        validate: function(input) {
          if (isNaN(input)) {
            return "Please type a number!";
          }

          return true;
        }
      }
    ]).then(function(input) {

      connection.query("SELECT stock_quantity FROM products WHERE item_id =?", [input.idinput], function(error, results, fields) {
        if (error) {
          start();
        }

        connection.query("UPDATE products SET ? WHERE ?", [{
              stock_quantity: input.quantity + results[0].stock_quantity
            },
            {
              item_id: input.idinput
            }
          ],
          function(e, r, f) {
            if (!e) {
              printTable();
              console.log("Inventory updated!");
            }
          });
      });
    });
}

function addNewProduct(){

  inquirer
  .prompt([
    {
    type: "input",
    name: "item",
    message: "What product would you like to add?"
  },
  {
    type: "input",
    name: "department",
    message: "In what department is this product?"
  },
  {
    type: "input",
    name: "price",
    message: "What is the price of this product?"
  },
  {
    type: "input",
    name: "quantity",
    message: "How many of this product would you like to add?"
  }
])

  .then(function(input){
    connection.query(
      "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('"+ input.item + "', '" + input.department + "' ," + input.price + "," + input.quantity + ");",
      function(error, results, fields) {
        if (error){
          console.log("Enter a valid id!");
          start();
        }
      if (!error){
        printTable();
        console.log("New product added!");
        start();
      }

    });
  });

}
