var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tara1",
    database: "bamazon"
});
inquire.prompt(
    {
        name: "action",
        type: "list",
        message: "Which action do you wish to perform?",
        choices: [
            "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"
        ]
    }
).then(function (ans) {
    switch (ans.action) {
        case "View Products for Sale":
            showAllProducts();
            break;
        case "View Low Inventory":
            showLowInventory();
            break;
        case "Add to Inventory":
            addInventory();
            break;
        case "Add New Product":
            inquire.prompt([
                {
                    name: "product",
                    type: "input",
                    message: "Enter the name of the product"
                },
                {
                    name: "dept",
                    type: "input",
                    message: "Enter the department name"
                },
                {
                    name: "price",
                    type: "input",
                    message: "Enter the unit price",
                    // check if input is an integer
                    validate: function (value) {
                        if (!isNaN(parseInt(value))) {
                            return true
                        } else {
                            return "amount to add must be an integer";
                        }
                    }
                },
                {
                    name: "quant",
                    type: "input",
                    message: "Enter the quantity to stock",
                    // check if input is an integer
                    validate: function (value) {
                        if (!isNaN(parseInt(value))) {
                            return true
                        } else {
                            return "amount to add must be an integer";
                        }
                    }
                }
            ]).then(function (ans) {
                addProduct(ans.product, ans.dept, ans.price, ans.quant);
            })
            break;
    }

});
//function to log item info- used by showAllProduct and showLowInventory
function showProducts(res) {
    for (i = 0; i < res.length; i++) {
        console.log(
            "ID: " + res[i].item_id + "\n" +
            "Product: " + res[i].product_name + "\n" +
            "Price: " + res[i].price + "\n" +
            "Inventory Count: " + res[i].stock_quantity + "\n" +
            "Department: " + res[i].department_name + "\n"
        )
    };
}
function showAllProducts() {
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) {
                throw err
            };
            showProducts(res);
        }
    )
    connection.end();
};
function showLowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity<?",
        // change this number to change definition of "low" stock
        5,
        function (err, res) {
            if (err) {
                throw err
            };
            // check if any products are low
            if (res.length > 0) {
                showProducts(res);
            } else {
                console.log("No products are understocked at this time!")
            }
        }
    )
    connection.end()
};

function addInventory() {
    inquire.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the id of the item to add stock",
            // check if input is an integer
            validate: function (value) {
                if (!isNaN(parseInt(value))) {
                    return true
                } else {
                    return "amount to add must be an integer";
                }
            }
        },
        {
            name: "addition",
            type: "input",
            message: "Enter the amount to be added",
            // check if input is an integer
            validate: function (value) {
                if (!isNaN(parseInt(value))) {
                    return true
                } else {
                    return "amount to add must be an integer";
                }
            }
        }
    ]).then(function (ans) {
        connection.query(
            `UPDATE products SET stock_quantity = stock_quantity + ${ans.addition} WHERE ?`,
            { item_id: parseInt(ans.id) },
            function (err, res) {
                if (err) {
                    throw err
                };
                console.log(`Added ${ans.addition} to product #${ans.id} stock`);
            }
        )
        connection.end();
    });
};
function addProduct(product, dept, price, quant) {
    connection.query(
        `INSERT INTO products SET ?`,
        {
            product_name: product,
            department_name: dept,
            price: price,
            stock_quantity: quant
        },
        function (err, res) {
            if (err) {
                throw err
            }
        }
    )
    connection.end();
}