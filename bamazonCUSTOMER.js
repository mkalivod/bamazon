const inquirer = require('inquirer');
const mysql = require('mysql');

//connect to the database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'madCoding07!',
	database: 'bamazon'
});


connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected!");
  });


  // Empty shopping cart.

connection.query("SELECT id, product, price FROM products", function(err, res) {
        console.log(res);
        promptOrder();
  });

  let itemInCart = {};
  let orderQuantity = 0;

const promptOrder = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "orderID",
            message: "What is the ID number of the product you would like to purchase?"
        },
        {
            type: "input",
            name: "orderQuantity",
            message: "How many units would you like?"
        }
    ]).then(answers => {
        connection.query("SELECT * FROM products WHERE id = ?", [answers.orderID], 
        function(err, res) {
            itemInCart = res;
            orderQuantity = answers.orderQuantity;
            itemInCart.stock_quantity >= orderQuantity 
                ? orderFullfill(itemInCart, orderQuantity) 
                : (console.log("Insufficient quantity!"), connection.close());  
            }
        );
    }).catch(err => {
        console.log(err);
    });
};

const orderFullfill = (itemInCart, orderQuantity) => {
    connection.query('UPDATE products SET Product_Sales = Product_Sales + ?, WHERE ?',
    [
        orderQuantity * itemInCart.price, 
        {stock_quantity: itemInCart.stock_quantity - orderQuantity},
        { id: itemInCart.id }
    ], 
        function(err, res) {
            console.log(res);
        } 
    );
connection.close();
};
