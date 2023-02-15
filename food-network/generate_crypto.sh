#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
# SCRIPT FOR GENERATING CERTIFICATES AND ARTIFACTS
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=mychannel
# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*
# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
	echo "Failed to generate crypto material..."
	exit 1
fi
# generate genesis block for orderer
configtxgen -profile FourOrgsOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
	echo "Failed to generate orderer genesis block..."
	exit 1
fi
# generate channel configuration transaction
configtxgen -profile FourOrgsChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
	echo "Failed to generate channel configuration transaction..."
	exit 1
fi
# generate anchor peer transaction
configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate ./config/Man1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Man1MSP
if [ "$?" -ne 0 ]; then
	echo "Failed to generate anchor peer update for Man1MSP..."
	exit 1
fi
# generate anchor peer transaction
configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate ./config/Dis1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Dis1MSP
if [ "$?" -ne 0 ]; then
	echo "Failed to generate anchor peer update for Dis1MSP..."
	exit 1
fi
# generate anchor peer transaction
configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate ./config/Ret1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Ret1MSP
if [ "$?" -ne 0 ]; then
	echo "Failed to generate anchor peer update for Ret1MSP..."
	exit 1
fi
# generate anchor peer transaction
configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate ./config/Con1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Con1MSP
if [ "$?" -ne 0 ]; then
	echo "Failed to generate anchor peer update for Con1MSP..."
	exit 1
fi