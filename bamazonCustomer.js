// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

inquire = require("inquirer");

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
]).then(function(answ){
// if id exists and quantity > requested amount
itemCheck(answ.id, answ.amount);
// adjust db and console.log cost
// else{
    // console.log("Order cannot be completed- insufficient quantity!");
// }
});

// looks up item's id and checks if quantity > requested amount
itemCheck=function(id, amount){

};

// adjusts db, calc and log cost
orderFulfilled=function(id, amount){

};


