## Starting the Network
The network is now distributed and is designed to run across multiple physical machines. The machines used are the NUC8i7HNK, Raspberry Pi and my Laptop. The network can run and operate as long as the orderer creates the channel and has one peer for interactions. Ideally, running on all the machines after the channel is created is intended. The startup and teardown scripts accomodate for using the different machines, meaning that you only need to run the script the same way for each and it will handle running what is required.

Running `./startNetwork.sh` from the `supplychain` folder will begin this process. 

It is required that the NUC8i7HNK is run first, with enough time given to create the channel and instantiate the chaincode. Once this is done running the same script on the other machines can be done whenever desired.

## Stopping the Network
Running `./stopNetwork.sh` will bring down the docker images but not remove them, whilst `./teardownNetwork.sh` will remove and reset any information regarding the network. Teardown is run when the network is started to remove any previous states. I recommend running `./teardownNetwork.sh` once you have finished and before turning off the machine.

## Crypto
A current version of the crypto is already generated and in the repository, if you intend to recreate the crypto then you will also need to re-link the certificates within the configuration files. 
### Recommended to not change the crypto for ease of use
* To generate new crypto:
  * Go to the 'food-network' folder
  * Run generate_crypto.sh
* The materials will be in the config & crypto-config folders.
* The code that will need to be changed if this is done is in the `docker-compose.yml` file
  * Change the properties `FABRIC_CA_SERVER_CA_KEYFILE` to correctly point to the newly generated crypto by name.

## Interact with Project
Once the network is up, in order to behave as a manufacturer, distributor, retailer or consumer run the javascript files located in 'supplychain/javascript' where you previously run `npm install`

To run these applications use `node manufacturer.js` for example.