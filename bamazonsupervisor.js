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
  start();

});

function start(){
  inquirer
    .prompt([
      {
      type: "list",
      message: "What would you like to do?",
      name: "supercommand",
      choices: ["View Product Sales by Department", "Create a Department"]
      }
    ])
    .then(function(command){
      switch (command.supercommand) {
        case "View Product Sales by Department":
            printTable();
            break;

        case "Create a Department":
        createDept();
            break;
      }
    });
}

function printTable() {
  connection.query("SELECT  departments.department_id, departments.overhead_costs, products.product_sales FROM departments INNER JOIN products ON departments.department_name = products.department_name ORDER BY department_id;", function(error, results, fields) {
    var table = new Table({
      head: ['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
      colWidths: [5, 30, 20, 20, 20]
    });


    console.log(table.toString());
    console.log ("SORRY, I COULDN'T FIGURE THIS OUT IN TIME! PLEASE CHECK OUT MY QUERY-- I WAS HAVING TROUBLE GROUPING/COLLAPSING WITHOUT LOSING PRODUCT SALES VALUES");

    console.log ("SELECT  departments.department_id, departments.overhead_costs, products.product_sales FROM departments INNER JOIN products ON departments.department_name = products.department_name ORDER BY department_id;");

    start();
  });
}

function createDept(){
  inquirer
  .prompt([
    {
    type: "input",
    name: "dept",
    message: "What is the name of the new department?"
  },
  {
    type: "input",
    name: "overhead",
    message: "What is the overhead for this department?",
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
]).then(function(input){
  connection.query("INSERT INTO departments (department_name, overhead_costs) VALUES ('" + input.dept + "', " + input.overhead + " );", function (er, res, f){
    if (!er){
    console.log ("Added department!");
    start();
  }
  }
);
});
}
