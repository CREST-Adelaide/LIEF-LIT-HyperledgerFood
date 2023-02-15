# Context 
The HyperledgerFood is a proof-of-concept of a blockchain-based food supply chain provenance solution. This prototype aims to explore the feasibility of operating such a system over hybrid infrastructures, comprising cloud services, fog computing nodes, and IoT edge devices that are owned and operated by separate entities across a food supply chain. 

The food supply chain starts from the manufacturer and incorporates each step in the process to reaching the end consumer. The HyperledgerFood system immutably records the transaction of food from one owner to the next to form an immutable provenance (lineage) of food products. Such information can support use cases such as tracking and tracing contaminated products to prevent outbreaks of food-borne illnesses. 

The Hyperledger Fabric blockchain platform was utilised to create a trustworthy and decentralised infrastructure to connect supply chain participants. The prototype was deployed on the testkits from the IoT testbed of the University of Adelaide. 

  
# Design and Implementation

The current state of the project is there are four organisations, a manufacturer, a distributor, a retailer and a consumer. This is aimed to represent a possible supply chain with your typical businesses. 

Ideally the food supply chain would go as follows; a product is farmed/created at a manufacturer, the manufacturer then puts the product into the system with all the relevant information. The product is bought by a distributor, and when the distributor receives the product it now updates the product with the new details such as location and time. The product is then passed to a retailer who then also updates the product. Lastly the product is sold to a consumer, and a consumer is able to view the history of the product through the supply chain. Viewing where it was made, what distributor and what retailer it was passed to. Also any other information that may be important such as expiry date. 

![[High-Level Use Case.png]]

The project implements this in a distributed manner. Any organisation can view the products and their history, but only a manufacturer can add an item. Only a distributor and retailer can update product details. These policies are not currently enforced within the endorsement policy and created chaincode but are rather a limitation in the SDK. This functionality is one of the very next steps in development.

## Use Cases

![[Organisation Use Case.png]]

The figure above describes the use cases offered by HyperledgerFood. These use cases are implemented as software components within blockchain and software clients operating outside the blockchain. 

## Components and Deployment

![[Current Deployment.png]]

The HyperledgerFood is a decentralised application that comprises **multiple types of peer nodes**: manufacturer, distributor, retailer, and consumer. Each type of peer node offers functionality suited for one type of food supply chain participant. 

Each peer also contains a replica of the blockchain, which contains life cycle records of all circulated food products. 

A special component called **orderer** that processes and appends blockchain transactions into the  blockchain. These transactions contain cryptographically signed life cycle records of food 
products, such as a handovers between distributors and retailers. 

Unlike majority of preexistent blockchain implementation, the blockchain of HyperledgerFood runs on a hybrid infrastructure, including stationary servers, mobile workstations, and resource-contrained edge devices (Raspberry Pi). Such hybrid infrastructure features heterogeneity in both hardware architecture and computing resources, posing unique challenges to operating a decentralised food supply chain provenance system. 

## Activity Flows

![[Transaction Sequence.png]]

The life cycle of a life cycle record starts from an information input request from a peer node. In the prototype, the input is captured in form of QR codes attached on food products. 

The information input triggers an SDK within the software of peer node, which in turn creates transactions. The transactions go through the endorsement and ordering protocols or validation and ordering before they are appended into the ledger and reflected in the state database. This activity flow is an implementation of the distributed consensus protocol utilised by the Hyperledger Fabric platform. 

# Benchmark and Demonstration

![[NUCwithPi.png]]

The figure above presents the performance and resource consumption level of the HyperledgerFood prototype over a testkit from the Ledger-integrated IoT Testbed at the University of Adelaide. 

Further screen captures and videos are available on [GitHub]()

# Instructions

## Blockchain Network

The blockchain network is as described above with the four organisations. Following these links will provide a description on how to launch this network. Currently it will only work for the given host names I have provided in the `Machine Information` Wiki page. It is setup to run across 3 physical machines, a laptop, NUC8i7HNK, and a Raspberry Pi. This can all be modifed within the configuration files by simply changing hostnames.

[How To: Install](docs/instructions/installation)

[How To: Run Network](docs/instructions/run_network)

## QR Code Scanner

This component is used to provide a method to interact with the blockchain network as a user. This component proposes a user to scan a QR code which contains product information. That information will be sent to a server who will act as a middleware for issuing a transaction. That transaction is sent to the endorsing peers and commited to the blockchain. Please see the following documentation for running the Phone app and server for allowing QR code scanning. Also described is how to create your own:

[How to: Run QR Server & Scanner](docs/instructions/qr_server)

## Utilities

### Blockchain Explorer

This component is used to provide a visual representation of the blockchain network once it is running. Example screen shots can be seen at the bottom of the `Caliper Performance Results` Wiki page. In order to run this component please view the following documentation:

[How to: Run Blockchain Explorer](docs/instructions/explorer)


### Hyperledger Caliper

This component is used to provide benchmarking for the described network. This tool is effective at stress testing multiple different blockchain solutions and hence can be applied to Hyperledger Fabric too. Currently it is setup for this network in particular and would require configuration changes to be made if the network is modified. Please see:

[How To: Run Hyperledger Caliper](docs/instructions/caliper)