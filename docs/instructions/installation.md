## Requirements:
* Docker - v17.06.2-ce or higher
* Docker Compose  - v1.14.0 or higher
* cURL
* Go - v1.11.x
  * export GOPATH=$HOME/go
  * export PATH=$PATH:$GOPATH/bin
* Node.js - v8.x (Preferably v8.16)
* Python - v2.7
* jq ( `sudo apt-get install jq` )
* Fabric 1.4.1 Docker Images for peer, orderer, tools, ccenv, ca, baseimage, baseos, javaenv

## Install
* Navigate to directory of choice and run
`curl -sSL http://bit.ly/2ysbOFE | bash -s`
* Proceed to the "supplychain" folder, and then javascript, and run `npm install`
* Verify that you have correctly copied the files by checking `git status`.