#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

HOSTNAME=$(hostname)
if [ $HOSTNAME = "raspberrypi_con_node" ]
then
	echo "Stopping Consumer Pi Script"
	COMPOSE_FILE="docker-compose-con-pi.yml"
elif [ $HOSTNAME = "mitch-ThinkPad-13" ]
then
	echo "Stopping Ubuntu Startup Script"
	COMPOSE_FILE="docker-compose-ret-laptop.yml"
elif [ $HOSTNAME = "hfs-NUC8i7HNK" ]
then
	echo "Stopping NUC Startup Script"
	COMPOSE_FILE="docker-compose-nuc.yml"
fi

# Shut down the Docker containers that might be currently running.
docker-compose -f $COMPOSE_FILE stop
