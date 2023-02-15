'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Takes the users choice and executes transactions accordingly
async function readProduct(product) {

    const ccpPath = path.resolve(__dirname, '..', '..', 'food-network', 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();

        var identity = '';
        if (product.owner == 'Man1') {
            identity = 'userMan01';
        } else if (product.owner == 'Dis1') {
            identity = 'userDis01';
        } else if (product.owner == 'Ret1') {
            identity = 'userRet01';
        } else if (product.owner == 'Con1') {
            identity = 'userCon01';
        }

        await gateway.connect(ccp, { wallet, identity: identity, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('supplychain');
        
        const result = await contract.evaluateTransaction('getProductHistory', product.gtin);
        var hist = JSON.parse(result);

        var i = 0;
        for (i=0; i<hist.length; i++) {
            console.log("**** Transaction " + (i+1) + " *****")
            console.log("Product: " + hist[i].Record.name + ", " + hist[i].Record.gtin + " at: " + hist[i].Record.time);
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

        console.log("History has been fetched for: " + product.gtin + ".");

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


module.exports = {
    readProduct: readProduct,
}