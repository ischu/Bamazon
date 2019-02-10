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
        // check if items are in stock
        itemCheck(answ.id, answ.amount);
    });
});

// looks up item's id and checks if quantity > requested amount
itemCheck = function (id, amount) {
    connection.query(
        // selects quantity data from column with correct id
        "SELECT stock_quantity FROM products WHERE ?",
        {
            item_id: id,
        },
        function (err, res) {
            if (err) {
                throw err
            };
            // if amount stocked is greater or equal to amount requested
            if (res[0].stock_quantity >= amount) {
                // run function for order successfully fulfilled
                orderFulfilled(id, amount);
            } else {
                console.log("Order cannot be completed- insufficient quantity!");
                connection.end();
            }
        }
    )
};

// adjusts db, calc and log cost
orderFulfilled = function (id, amount) {
    connection.query(
        // selects quantity data from column with correct id
        "SELECT product_name, price, stock_quantity FROM products WHERE ?",
        {
            item_id: id,
        },
        function (err, res) {
            if (err) {
                throw err
            };
            let totalCost = res[0].price * amount;
            let adjustedAmt = res[0].stock_quantity - amount;
            console.log(`Order Placed! You bought ${amount} ${res[0].product_name} for ${totalCost} dollars!`);
            inventoryAdjust(id, adjustedAmt);
        }
    )
};

inventoryAdjust = function (id, amount) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: amount
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) {
                throw err
            };
            connection.end();
        }
    )
};

