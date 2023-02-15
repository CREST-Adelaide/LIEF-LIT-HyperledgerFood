echo "**** Reading Man1 Container Logs ****"
docker logs $(docker ps -aqf "name=peer0.man1.com-supplychain" )

echo "**** Reading Dis1 Container Logs ****"
docker logs $(docker ps -aqf "name=peer0.dis1.com-supplychain" )



