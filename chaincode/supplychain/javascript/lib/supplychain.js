/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Supplychain extends Contract {

    // Adds some initial data to the ledger
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const products = [
            {
                name: 'Beef',
                amount: '25kg',
                location: 'Adelaide',
                gtin: '001',
                time: '2019-7-17 12:27:50',
                expiry: '2019-7-24',
                owner: 'Man1',
                price: '$50'
            },
            {
                name: 'Carrots',
                amount: '10kg',
                location: 'Perth',
                gtin: '002',
                time: '2019-4-12 09:12:36',
                expiry: '2019-4-20',
                owner: 'Man1',
                price: '$12'
            },
        ];

        console.info('Initialised by Man1: ');
        for (let i = 0; i < products.length; i++) {
            products[i].docType = 'info';
            await ctx.stub.putState(products[i].gtin + '', Buffer.from(JSON.stringify(products[i])));
            console.info('Added <--> ', products[i]);
        }
        console.info('============= END : Initialise Ledger ===========');
    }

    // Returns current state of a given product
    async queryProduct(ctx, gtin) {
        const infoAsBytes = await ctx.stub.getState(gtin);
        if (!infoAsBytes || infoAsBytes.length === 0) {
            throw new Error(`${gtin} does not exist`);
        }
        console.log(infoAsBytes.toString());
        return infoAsBytes.toString();
    }

    // Adds new product to the supply chain
    async addProduct(ctx, name, amount, location, gtin, time, expiry, owner, price) {
        console.info('============= START : Add Product ===========');

        const product = {
            docType: 'info',
            name,
            amount,
            location,
            gtin,
            time,
            expiry,
            owner,
            price,
        };

        await ctx.stub.putState(gtin, Buffer.from(JSON.stringify(product)));
        console.info('Added ' + owner + ' <--> ', product);
        console.info('============= END : Product Added ===========');
    }

    // Updates a product by gtin
    async updateProduct(ctx, name, amount, location, gtin, time, expiry, owner, price) {
        console.info('============= START : Update Product ===========');

        const product = {
            docType: 'info',
            name,
            amount,
            location,
            gtin,
            time,
            expiry,
            owner,
            price,
        };

        await ctx.stub.putState(gtin, Buffer.from(JSON.stringify(product)));
        console.info('Updated by ' + owner + ' <--> ', product);
        console.info('============= END : Product Updated ===========');
    }

    // Returns the transaction history for a given product
    async getProductHistory(ctx, gtin) {
        console.info('============= START : Fetching history for ' + gtin + ' ===========');

        const historyIer = await ctx.stub.getHistoryForKey(gtin);

        const allHistory = [];
        while (true) {
            const res = await historyIer.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allHistory.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await historyIer.close();
                console.info(allHistory);
                console.info('============= END : All information received ===========');
                return JSON.stringify(allHistory);
            }
        }
    }

    // Returns the current world state of all products in the ledger
    async getAllProducts(ctx) {
        console.info('============= START : Fetching all products ===========');

        // Iterates through all entries in the ledger
        const iterator = await ctx.stub.getStateByRange('', '');

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                console.info('============= END : All products received ===========');
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = Supplychain;
