#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -e

HOSTNAME=$(hostname)
if [ $HOSTNAME = "raspberrypi_con_node" ]
then
	echo "TearingDown Consumer Pi Script"
	COMPOSE_FILE="docker-compose-con-pi.yml"
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	echo "TearingDown Ubuntu Startup Script"
	COMPOSE_FILE="docker-compose-ret-laptop.yml"
elif [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	echo "TearingDown NUC Startup Script"
	COMPOSE_FILE="docker-compose-nuc.yml"
fi

# Shut down the Docker containers for the system tests.
docker-compose -f $COMPOSE_FILE kill && docker-compose -f $COMPOSE_FILE down

# remove the local state
rm -f ~/.hfc-key-store/*

# remove chaincode docker images
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images dev-* -q)

# Your system is now clean
