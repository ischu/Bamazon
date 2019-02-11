// * List a set of menu options:
    // * View Products for Sale
    // * View Low Inventory
    // * Add to Inventory
    // * Add New Product
// * If a manager selects `View Products for Sale`, the app should list every available item:
    // the item IDs, names, prices, and quantities.
// * If a manager selects `View Low Inventory`, then it should 
    // list all items with an inventory count lower than five.
// * If a manager selects `Add to Inventory`, your app should 
    // display a prompt that will let the manager "add more" of any item currently in the store.
// * If a manager selects `Add New Product`, it should 
    // allow the manager to add a completely new product to the store.

var mysql = require("mysql");
var inquire = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tara1",
    database: "bamazon"
});

inquirer.prompt(
    {
    type: "list",
    message: "Which action do you wish to perform?",
    choices: [
        "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"
    ]
    }
).then(function(ans){
    switch (ans.list){
        case "View Products for Sale":
        showAllProducts();
        break;
        case "View Low Inventory":
        showLowProducts();
        break;
        case "Add to Inventory":
        addInventory();
        break;
        case "Add New Product":
        addProduct();
        break;
    }

})