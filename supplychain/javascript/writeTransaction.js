'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Takes the users choice and executes transactions accordingly
async function writeProduct(product) {

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
            console.log('Consumer Cannot Add Product, only Read');
            process.exit(1);
        }

        await gateway.connect(ccp, { wallet, identity: identity, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('supplychain');

        var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

        await contract.submitTransaction('updateProduct', product.name, product.amount, product.location, product.gtin, time, product.expiry, product.owner, product.price);
        console.log('Transaction has been submitted for Product: ' + product.name + ", GTIN: " + product.gtin);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}


module.exports = {
    writeProduct: writeProduct,
}