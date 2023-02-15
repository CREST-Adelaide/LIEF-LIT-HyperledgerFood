#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`
CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=/opt/gopath/src/github.com/supplychain/javascript


HOSTNAME=$(hostname)
if [ $HOSTNAME = "raspberrypi_con_node" ]
then
	echo "Running Pi Teardown Script"
	COMPOSE_FILE="docker-compose-con-pi.yml"
	export NUC_IP=$(avahi-resolve --name hfs-NUC8i7HNK.local | awk '{ print $2 }')
	export NUC_IP=$(avahi-resolve --name hfs-NUC8i7HNK.local | awk '{ print $2 }')
	export RETAILER_IP=$(avahi-resolve --name mitch-ThinkPad-13.local | awk '{ print $2 }')
	export RETAILER_IP=$(avahi-resolve --name mitch-ThinkPad-13.local | awk '{ print $2 }')
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	echo "Running Ubuntu Teardown Script"
	COMPOSE_FILE="docker-compose-ret-laptop.yml"
	export NUC_IP=$(avahi-resolve --name hfs-NUC8i7HNK.local | awk '{ print $2 }')
	export NUC_IP=$(avahi-resolve --name hfs-NUC8i7HNK.local | awk '{ print $2 }')
	export CONSUMER_IP=$(avahi-resolve --name raspberrypi_con_node.local | awk '{ print $2 }')
	export CONSUMER_IP=$(avahi-resolve --name raspberrypi_con_node.local | awk '{ print $2 }')
elif [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	echo "Running NUC Teardown Script"
	COMPOSE_FILE="docker-compose-nuc.yml"
	export RETAILER_IP=$(avahi-resolve --name mitch-ThinkPad-13.local | awk '{ print $2 }')
	export RETAILER_IP=$(avahi-resolve --name mitch-ThinkPad-13.local | awk '{ print $2 }')
	export CONSUMER_IP=$(avahi-resolve --name raspberrypi_con_node.local | awk '{ print $2 }')
	export CONSUMER_IP=$(avahi-resolve --name raspberrypi_con_node.local | awk '{ print $2 }')
fi

# clean the keystore
rm -rf ./hfc-key-store

# launch network; create channel and join peer to channel
cd ../food-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
docker-compose -f ./$COMPOSE_FILE up -d cli
docker ps -a

if [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# Installing chaincode on all four peers
	echo "**** INSTALLING CHAINCODE ON CLI PEER USING MAN1 PEER0 ****"
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/man1.com/users/Admin@man1.com/msp" cli peer chaincode install -n supplychain -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

	echo "**** INSTALLING CHAINCODE ON CLI PEER USING DIS1 PEER0 ****"
	docker exec -e "CORE_PEER_LOCALMSPID=Dis1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/dis1.com/users/Admin@dis1.com/msp" -e "CORE_PEER_ADDRESS=peer0.dis1.com:7051" cli peer chaincode install -n supplychain -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	echo "**** INSTALLING CHAINCODE ON CLI PEER USING RET1 PEER0 ****"
	docker exec -e "CORE_PEER_LOCALMSPID=Ret1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ret1.com/users/Admin@ret1.com/msp" -e "CORE_PEER_ADDRESS=peer0.ret1.com:7051" cli peer chaincode install -n supplychain -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
elif [ $HOSTNAME = "raspberrypi_con_node" ]
then
	echo "**** INSTALLING CHAINCODE ON CLI PEER USING CON1 PEER0 ****"
	docker exec -e "CORE_PEER_LOCALMSPID=Con1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/con1.com/users/Admin@con1.com/msp" -e "CORE_PEER_ADDRESS=peer0.con1.com:7051" cli peer chaincode install -n supplychain -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
fi

if [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# Instantiating the chaincode once on the cli (setting up initial values)
	echo "**** INSTANTIATING CHAINCODE ON CLI PEER USING MAN1 PEER0 ****"
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/man1.com/users/Admin@man1.com/msp" cli peer chaincode instantiate -o hfs-NUC8i7HNK:7050 -C mychannel -n supplychain -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Man1MSP.member','Dis1MSP.member', 'Ret1MSP.member', 'Con1MSP.member')"
fi

if [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# Initialising ledger by invoking the initLedger function from peer0.man1
	echo "**** INVOKING CHAINCODE ON CLI PEER USING MAN1 PEER0 ****"
	sleep 10
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/man1.com/users/Admin@man1.com/msp" cli peer chaincode invoke -o hfs-NUC8i7HNK:7050 -C mychannel -n supplychain -c '{"function":"initLedger","Args":[]}'

	# Creating peer images by invoking the getAllProducts function from peer0.dis1
	echo "**** INVOKING CHAINCODE ON CLI PEER USING DIS1 PEER0 ****"
	sleep 10
	docker exec -e "CORE_PEER_LOCALMSPID=Dis1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/dis1.com/users/Admin@dis1.com/msp" cli peer chaincode invoke -o hfs-NUC8i7HNK:7050 -C mychannel -n supplychain -c '{"function":"getAllProducts","Args":[]}'

elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	# Creating peer images by invoking the getAllProducts function from peer0.ret1
	echo "**** INVOKING CHAINCODE ON CLI PEER USING RET1 PEER0 ****"
	sleep 10
	docker exec -e "CORE_PEER_LOCALMSPID=Ret1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/ret1.com/users/Admin@ret1.com/msp" cli peer chaincode invoke -o hfs-NUC8i7HNK:7050 -C mychannel -n supplychain -c '{"function":"getAllProducts","Args":[]}'
elif [ $HOSTNAME = "raspberrypi_con_node" ]
then
	# Creating peer images by invoking the getAllProducts function from peer0.con1
	echo "**** INVOKING CHAINCODE ON CLI PEER USING DIS1 PEER0 ****"
	sleep 10
	docker exec -e "CORE_PEER_LOCALMSPID=Con1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/con1.com/users/Admin@con1.com/msp" cli peer chaincode invoke -o hfs-NUC8i7HNK:7050 -C mychannel -n supplychain -c '{"function":"getAllProducts","Args":[]}'
fi



cat <<EOF

EOF
