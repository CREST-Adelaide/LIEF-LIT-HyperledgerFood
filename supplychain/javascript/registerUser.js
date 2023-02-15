/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'food-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function enrollManUser() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('userMan01');
        if (userExists) {
            console.log('An identity for the user "userMan01" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminMan');
        if (!adminExists) {
            console.log('An identity for the manufacturer admin user "adminMan" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'adminMan', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority("Man1CA");
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'userMan01', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'userMan01', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Man1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('userMan01', userIdentity);
        console.log('Successfully registered and enrolled Man1 user "userMan01" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "userMan01": ${error}`);
        process.exit(1);
    }
}

async function enrollDisUser() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('userDis01');
        if (userExists) {
            console.log('An identity for the user "userDis01" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminDis');
        if (!adminExists) {
            console.log('An identity for the distributor admin user "adminDis" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'adminDis', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority("Dis1CA");
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'userDis01', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'userDis01', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Dis1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('userDis01', userIdentity);
        console.log('Successfully registered and enrolled Dis1 user "userDis01" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "userDis01": ${error}`);
        process.exit(1);
    }
}

async function enrollRetUser() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('userRet01');
        if (userExists) {
            console.log('An identity for the user "userRet01" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminRet');
        if (!adminExists) {
            console.log('An identity for the retailer admin user "adminRet" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'adminRet', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority("Ret1CA");
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'userRet01', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'userRet01', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Ret1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('userRet01', userIdentity);
        console.log('Successfully registered and enrolled Ret1 user "userRet01" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "userRet01": ${error}`);
        process.exit(1);
    }
}

async function enrollConUser() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('userCon01');
        if (userExists) {
            console.log('An identity for the user "userCon01" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminCon');
        if (!adminExists) {
            console.log('An identity for the consumer admin user "adminCon" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'adminCon', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority("Con1CA");
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'userCon01', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'userCon01', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Con1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('userCon01', userIdentity);
        console.log('Successfully registered and enrolled Con1 user "userCon01" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "userCon01": ${error}`);
        process.exit(1);
    }
}

async function enrollUsers() {
    try {
        await enrollManUser();

        await enrollDisUser();

        await enrollRetUser();

        await enrollConUser();
    } catch (error) {
        console.error(`Failed to register a user: ${error}`);
        process.exit(1);
    }
}

enrollUsers();
