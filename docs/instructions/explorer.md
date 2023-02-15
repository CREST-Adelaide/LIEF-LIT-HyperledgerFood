## Blockchain Explorer

`https://github.com/hyperledger/blockchain-explorer`

Blockchain Explorer is an external repository that has been used to provide a visualisation of the blockchain network as it is running. It displays information from ranging from; chaincode, number of peers, transactions, blocks, endorsement, timing, etc.

It is setup to work for this blockchain running off of my laptop, the NUC and a raspberry pi. My laptop is using hostname: `mitch-ThinkPad-13` so searching for this in the repository will lead you to where you need to change anything to have it work on your machine instead. The NUC and Pi can stay the same if you use the same machines.

### Setting Up
Clone the repository listed at the top of this page into the root directory of this repository. Make sure to have the version of the files from this code base (only 3 or so files).

### Running
Once the blockchain network is deployed (ie. orderer node has created the channel) then simply running `./start.sh` from the `blockchain-explorer` folder will start the webpage.

The website is located at: `localhost:8080` and the default login is:
* username: `admin`
* password: `adminpw`

It is currently used with the NUC and I would recommend launching it there as it is already functional.