// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tara1",
    database: "bamazon"
});

inquire.prompt([
    {
        name: "id",
        type: "input",
        message: "Enter id of item you wish to purchase"
    },
    {
        name: "amount",
        type: "input",
        message: "How many items do you wish to purchase?"
    }
]).then(function (answ) {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected to Bamazon \n");
        itemCheck(answ.id, answ.amount);
        connection.end();
    });
    // if id exists and quantity > requested amount
    // adjust db and console.log cost
    // else{
    // console.log("Order cannot be completed- insufficient quantity!");
    // }
});

// function readProducts() {
//     console.log("Selecting all products...\n");
//     connection.query("SELECT * FROM products", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.log(res);
//       connection.end();
//     });
//   }

// looks up item's id and checks if quantity > requested amount
itemCheck = function (id, amount) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        {
            item_id: id,
        },
        function (err, res) {
            console.log(res[0].stock_quantity);
            if (err) {
                throw err
            };
            // if amount stocked is greater or equal to amount requested
            if (res[0].stock_quantity > amount) {
                // run function for order successfully fulfilled
                orderFulfilled(id, amount);
            } else {
                console.log("Order cannot be completed- insufficient quantity!");
            }
        }
    )
};

// adjusts db, calc and log cost
orderFulfilled = function (id, amount) {
    console.log("You purchased "+amount+" items with id "+id+"!");
};


