var inquirer = require('inquirer');
var mysql = require('mysql');

//connect to the database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'madCoding7',
	database: 'bamazon'
});


// Customer creates an order.
var customerOrder = () => {
  inquirer.prompt([
      {
        type: "input",
        name: "productOrdered",
        message: "What is the ID number of the item you want to buy?"
      },
      {
        type: "input",
        name: "quantityOrdered",
        message: "How many units do you want to buy?"
      }
    ]).then(answers => {
      connection.query("SELECT * FROM `products` WHERE `item_id` = ?", 
      [answers.productOrdered], 
      function(err, results) {
          itemInCart = results[0];
           quantityOrdered = answers.quantityOrdered;
            itemInCart.stock_quantity >= quantityOrdered
            ? fulfillOrder(itemInCart, quantityOrdered)
            : (console.log("Insufficient quantity!"), 
            
            connection.close());
        }
      );
    })
    .catch(err => {
      console.log(err);
    });
};


connection.query(SELECT * FROM 'products', WHERE `item_id` = ?, function(err,results) {
    console.log("Items for sale today at Bamazon:\n");
    results.forEach(result => {
      console.log(
        `Item ${result.item_id} - ${result.product_name} - $${result.price}`
      );
    });
    customerOrder();
  });
});