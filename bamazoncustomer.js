var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table-redemption");
var count = 0;

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
  printTable(count);

});


function start() {


  inquirer
    .prompt([{
        name: "idinput",
        type: "input",
        message: "Please type in the ID of the product you'd like to buy.",
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
        message: "How many units would you like?",
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


    ])
    .then(function(answer) {

      connection.query("SELECT stock_quantity FROM products WHERE item_id =?", [answer.idinput], function(error, results, fields) {
        if (error) {
          console.log(error);
        } else if (!error) {
          if (answer.quantity > results[0].stock_quantity) {
            console.log("INSUFFICIENT QUANTITY!");
            start();
          } else if (answer.quantity <= results[0].stock_quantity) {
            var resultQuantity = results[0].stock_quantity;
            var userQuantity = answer.quantity;
            var userID = answer.idinput;
            connection.query("UPDATE products SET ? WHERE ?", [{
                  stock_quantity: resultQuantity - userQuantity
                },
                {
                  item_id: userID
                }
              ],
              function(e, r, f) {
                if (!e) {


                  connection.query("SELECT * FROM products WHERE item_id =?", [userID], function(err, res, f) {
                    var cost = res[0].price * userQuantity;
                    console.log("That will be $" + cost + " please!");
                    count++;
                    var timeOut = setTimeout(function() {
                      printTable(count);
                      clearTimeout(timeOut);
                    }, 4000);


                  });
                }

              });
          }


        }
      });
    });
}


function printTable(count) {
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
