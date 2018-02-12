
// Dependancies
var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'madCoding07!',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err; 
});

let productInCart = {};
let quantityOrdered = 0;

// Create order 
const customerOrder = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "productOrdered",
            message: "What is the ID number of the product you would like to purchase?"
        },
        {
            type: "input",
            name: "quantityOrdered",
            message: "How many units of the product would you like to purchase?"
        }
    ]).then(answers => {
        connection.query("SELECT * FROM 'products' WHERE id = ?", [answer.productedOrdered],
            function(err, results) {
                productInCart = results[0];
                quantityOrdered = answers.quantityOrdered;
                productInCart.stock_quantity >= quantityOrdered
                ? fillOrder(productInCart, quantityOrdered)
                : (console.log("Insufficient quantity!"), connection.close());
            }
        );
    })
    .catch(err => {
        console.log(err);
    });  
};

const fillOrder = (productInCart, quantityOrdered) => {
    connection.query(
        "UPDATE 'products' SET product_sales = product_sales + ?, ? WHERE ?", 
        [ 
            quantityOrdered * productInCart.price,
            { stock_quantity: productInCart.stock_quantity - quantityOrdered },
            { id: productInCart.id }
        ], 
        function(err, results) {
            console.log(results);
            console.log('Purchased ${quantityOrdered} units(s) of ${productInCart.product}. Your total is $${productInCart.price * quantityOrdered}.');
        }
    );
    connection.close();
};


connection.query("SELECT * FROM 'products' WHHERE deleted is null", function(err, results) {
    results.forEach(result => {
        console.log('Item ${result.id} - ${result.product} - $${result.price}');
    });
    customerOrder();
});