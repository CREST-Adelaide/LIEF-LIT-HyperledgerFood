'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'food-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const readline = require('readline-sync');

// Takes the users choice and executes transactions accordingly
async function interact(user_choice) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'userMan01', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('supplychain');

        // Gets the history of transactions for a specific product
        if (user_choice == 'h') {
            let gtin_num = readline.question("Which product do you want to view the history of? (enter GTIN number) ");
            
            const result = await contract.evaluateTransaction('getProductHistory', gtin_num.toString());
            var hist = JSON.parse(result);

            var i = 0;
            for (i=0; i<hist.length; i++) {
                console.log("**** Transaction " + (i+1) + " *****")
                console.log("Product: " + hist[i].Record.name + ", " + gtin_num.toString() + " at: " + hist[i].Record.time);
                console.log(":\tProduct Name: " + hist[i].Record.name);
                console.log(":\tAmount: " + hist[i].Record.amount);
                console.log(":\tLocation: " + hist[i].Record.location);
                console.log(":\tGTIN: " + hist[i].Record.gtin);
                console.log(":\tTime: " + hist[i].Record.time);
                console.log(":\tExpiry: " + hist[i].Record.expiry);
                console.log(":\tOwner: " + hist[i].Record.owner);
                console.log(":\tPrice: " + hist[i].Record.price);
                console.log();
            }

            console.log("History has been fetched for: " + gtin_num + ".");
        }
        // Adding a product to the supply chain (manufacturer only)
        else if (user_choice =='a') {
            let choice = readline.question("Would you like to get the data from products.json file? (y/n) ");

            if (choice == 'y') {
                try {
                    const jsonString = fs.readFileSync('./json_data/product.json')
                    const product = JSON.parse(jsonString);
                    let time = new Date().toLocaleString();

                    await contract.submitTransaction('addProduct', product.name, product.amount, product.location, product.gtin, time, product.expiry, 'Man1', product.price);
                    console.log('Transaction has been submitted, Product: ' + product.name + ", GTIN: " + product.gtin + " added.");
                } catch(err) {
                    console.log(err);
                    return
                }
            }
            else if (choice == 'n') {
                console.log("**** Requesting Product Information ****");
                let gtin_num = readline.question("Product GTIN Number:");
                gtin_num = gtin_num.toString();

                let name = readline.question("Product Name:");
                name = name.toString();

                let amount = readline.question("Amount of Product:");
                amount = amount.toString();

                let location = readline.question("Product Location:");
                location = location.toString();

                let expiry = readline.question("Product Expiry:");
                expiry = expiry.toString();

                let time = new Date().toLocaleString();

                let price = readline.question("Product Price:");
                price = price.toString();

                await contract.submitTransaction('addProduct', name, amount, location, gtin_num, time, expiry, 'Man1', price);
                console.log('Transaction has been submitted, Product: ' + name + ", GTIN: " + gtin_num + " added.");
            }
            else {
                console.log("Unrecognised input, please try again.");
                return;
            }
            
        }
        // Printing the current world state of the ledger
        else if (user_choice == 'i') {

            // Executes chaincode transaction to view all current product information
            const result = await contract.evaluateTransaction('getAllProducts');
            var products = JSON.parse(result);

            var i = 0;
            for (i=0; i<products.length; i++) {
                console.log(products[i].Key);
                console.log(":\tProduct Name: " + products[i].Record.name);
                console.log(":\tAmount: " + products[i].Record.amount);
                console.log(":\tLocation: " + products[i].Record.location);
                console.log(":\tGTIN: " + products[i].Record.gtin);
                console.log(":\tTime: " + products[i].Record.time);
                console.log(":\tExpiry: " + products[i].Record.expiry);
                console.log(":\tOwner: " + products[i].Record.owner);
                console.log(":\tPrice: " + products[i].Record.price);
            }
            console.log("**** End of Ledger ****");
        }
        // Updating product information regarding amount, location, owner and price
        else if (user_choice =='u') {
            let gtin_num = readline.question("Which product are you updating? (enter GTIN number) ");

            const prod = await contract.evaluateTransaction('queryProduct', gtin_num);
            var product = JSON.parse(prod);

            let amount = readline.question("Amount of product: ");
            amount = amount.toString();

            let loc = readline.question("Location of product: ");
            loc = loc.toString();

            let price = readline.question("Price of product now: ");
            price = price.toString();

            gtin_num = gtin_num.toString();

            let time = new Date().toLocaleString();

            await contract.submitTransaction('updateProduct', product.name, amount, loc, product.gtin, time, product.expiry, 'Man1', price);
            console.log('Transaction has been submitted, Product: ' + product.name + ", GTIN: " + gtin_num + " updated.");
        }
        // If not a valid input
        else {
            console.log("**** Please choose a valid option ****" + ":\n");
            await gateway.disconnect();
            main();
        }

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

function main() {
    console.log("**** Logged in as Manufacturer 01 ****");
    console.log();

    // Provides options for user
    console.log("a : Add a product to the supply chain");
    console.log("i : Prints all products in the ledger");
    console.log("u : Update product information");
    console.log("h : View provenance of specific product");
    console.log("q : Quit");
    let user_choice = readline.question("What is your choice? ");

    if (user_choice == 'q') {
        console.log("Goodbye!");
        return;
    }

    interact(user_choice);
}

main(); 