/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'food-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function enrollMan1() {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['Man1CA'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminMan');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Man1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('adminMan', identity);
        console.log('Successfully enrolled Man1 admin user "adminMan" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll Man1 admin user "adminMan": ${error}`);
        process.exit(1);
    }
}

async function enrollDis1() {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['Dis1CA'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminDis');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Dis1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('adminDis', identity);
        console.log('Successfully enrolled Dis1 admin user "adminDis" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll Dis1 admin user "adminDis": ${error}`);
        process.exit(1);
    }
}

async function enrollRet1() {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['Ret1CA'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminRet');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Ret1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('adminRet', identity);
        console.log('Successfully enrolled Ret1 admin user "adminRet" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll Ret1 admin user "adminRet": ${error}`);
        process.exit(1);
    }
}

async function enrollCon1() {
    try {

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['Con1CA'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('adminCon');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Con1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('adminCon', identity);
        console.log('Successfully enrolled Con1 admin user "adminCon" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll Con1 admin user "adminCon": ${error}`);
        process.exit(1);
    }
}

async function enrollAdmins() {
    try {
        await enrollMan1();

        await enrollDis1();

        await enrollRet1();

        await enrollCon1();
    } catch (error) {
        console.error(`Failed to register an admin: ${error}`);
        process.exit(1);
    }
}

enrollAdmins();