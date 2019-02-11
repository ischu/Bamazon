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
function itemCheck (id, amount) {
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
function orderFulfilled (id, amount) {
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

function inventoryAdjust (id, amount) {
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

