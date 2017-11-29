var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require ("cli-table-redemption");

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
  printTable();
  start();
});


function start() {


  inquirer
    .prompt([
      {
      name: "idinput",
      type: "input",
      message: "Please type in the ID of the product you'd like to buy."
      // validate: function (input){
      //   if (input.charAt()){
      //     return "Please type a number!";
      //   }
      //   return true;
      // }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units would you like?"
        // validate: function (input){
        //   if (input.charAt()){
        //     return "Please type a number!";
        //   }
        //   return true;
      }


  ])
    .then(function(answer) {
        var id = answer.idinput;
        var userquantity = answer.quantity;


        connection.query("SELECT stock_quantity FROM products WHERE item_id =?", [id], function(error, results, fields) {
            var resultsvar = results[0];
              if (userquantity > resultsvar.stock_quantity){
                console.log ("INSUFFICIENT QUANTITY!");
                start();
              }
              else if (userquantity <= resultsvar.stock_quantity){
                connection.query ("UPDATE products SET ? WHERE ?",
                [{
                  quantity: (resultsvar.stock_quantity - userquantity)
                },
                {
                  id: id
                }
              ],
                function (error, results, fields){
                  if (!error){
                    connection.query ("SELECT * FROM products WHERE item_id =?", [id], function (error, results, fields){
                      var cost = results[0].price * results[0].stock_quantity;
                      console.log("That will be " + cost + " please!");
                    });
                  }

                });
              }



    });
});
}


function printTable(){
  connection.query("SELECT * FROM products", function(error, results, fields) {
        var table = new Table({
            head: ['ID', 'ITEM', 'DEPARTMENT','PRICE', 'QUANTITY'],
            colWidths: [5, 30, 20, 10, 10]
        });

        for (var i = 0; i<results.length; i++){
          table.push(
              [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
          );
        }


        console.log(table.toString());
      });

}
