#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -e
# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
LANGUAGE=${1:-"node"}

HOSTNAME=$(hostname)
if [ $HOSTNAME = "raspberrypi_con_node" ]
then
	echo "Running Consumer Pi Script"
	COMPOSE_FILE="docker-compose-con-pi.yml"
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	echo "Running Ubuntu Startup Script"
	COMPOSE_FILE="docker-compose-ret-laptop.yml"
elif [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	echo "Running NUC Startup Script"
	COMPOSE_FILE="docker-compose-nuc.yml"
fi

# clean the keystore
rm -rf ./hfc-key-store
docker-compose -f $COMPOSE_FILE down

if [ $HOSTNAME = "raspberrypi_con_node" ]
then
	docker-compose -f $COMPOSE_FILE up -d peer0.con1.com couchdb2
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	docker-compose -f $COMPOSE_FILE up -d peer0.ret1.com couchdb3
elif [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# docker-compose -f $COMPOSE_FILE up -d Man1CA Dis1CA Ret1CA Con1CA orderer.com peer0.man1.com peer0.dis1.com couchdb
	docker-compose -f $COMPOSE_FILE up -d orderer.com peer0.man1.com peer0.dis1.com couchdb
fi

docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export 
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

if [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# Create the channel
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@man1.com/msp" peer0.man1.com peer channel create -o orderer.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
	# Join peer0.man1.com to the channel.
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@man1.com/msp" peer0.man1.com peer channel join -b mychannel.block
	# fetch channel config block org2
	docker exec -e "CORE_PEER_LOCALMSPID=Dis1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@dis1.com/msp"  peer0.dis1.com peer channel fetch 0 mychannel.block -c mychannel -o orderer.com:7050
	# join peer0.dis1.com peer to channel
	docker exec -e  "CORE_PEER_LOCALMSPID=Dis1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@dis1.com/msp"  peer0.dis1.com peer channel join -b mychannel.block
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	# fetch channel config block org2
	docker exec -e "CORE_PEER_LOCALMSPID=Ret1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ret1.com/msp"  peer0.ret1.com peer channel fetch 0 mychannel.block -c mychannel -o orderer.com:7050
	# join peer0.ret1.com peer to channel
	docker exec -e  "CORE_PEER_LOCALMSPID=Ret1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ret1.com/msp"  peer0.ret1.com peer channel join -b mychannel.block
elif [ $HOSTNAME = "raspberrypi_con_node" ]
then
	# fetch channel config block org2
	docker exec -e "CORE_PEER_LOCALMSPID=Con1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@con1.com/msp"  peer0.con1.com peer channel fetch 0 mychannel.block -c mychannel -o orderer.com:7050
	# join peer0.con1.com peer to channel
	docker exec -e  "CORE_PEER_LOCALMSPID=Con1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@con1.com/msp"  peer0.con1.com peer channel join -b mychannel.block
fi

if [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	# update anchor peers
	docker exec -e "CORE_PEER_LOCALMSPID=Man1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@man1.com/msp"  peer0.man1.com  peer channel update -o orderer.com:7050 -c mychannel -f /etc/hyperledger/configtx/Man1MSPanchors.tx
	docker exec -e "CORE_PEER_LOCALMSPID=Dis1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@dis1.com/msp"  peer0.dis1.com  peer channel update -o orderer.com:7050 -c mychannel -f /etc/hyperledger/configtx/Dis1MSPanchors.tx
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	docker exec -e "CORE_PEER_LOCALMSPID=Ret1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@ret1.com/msp"  peer0.ret1.com  peer channel update -o orderer.com:7050 -c mychannel -f /etc/hyperledger/configtx/Ret1MSPanchors.tx
elif [ $HOSTNAME = "raspberrypi_con_node" ]
then
	docker exec -e "CORE_PEER_LOCALMSPID=Con1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@con1.com/msp"  peer0.con1.com  peer channel update -o orderer.com:7050 -c mychannel -f /etc/hyperledger/configtx/Con1MSPanchors.tx
fi