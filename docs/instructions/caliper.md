## Hyperledger Caliper

`https://github.com/hyperledger/caliper`

`https://hyperledger.github.io/caliper/vLatest/installing-caliper/`

Hyperledger Caliper is a repository that provides functionality for benchmarking various blockchain networks (fabric, ethereum, composer etc). It is useful for identifying how well the network performs and can provide insight into what leads to a reduction or improvement in performance. It measures aspects such as;
**# of Success, # of Fails, Send Rate, Max/Min/Average Latency and Throughput**.

## Installing

To use this functionality for this network the following actions need to be done. Clone this repository, `https://github.com/hyperledger/caliper-benchmarks`, into the root directory for this repository (where there is already a caliper-benchmarks folder). I would recommend for ease to delete the current `caliper-benchmarks` folder and then clone this repository. Once this is cloned then reset the files that were deleted by doing:
`git reset --hard HEAD`. Now the files should be in the correct places and ready to operate.

Upon first time running perform the following 3 commands from inside the `caliper-benchmarks` folder:

`npm init -y`

`npm install --only=prod @hyperledger/caliper-cli`

`npx caliper bind --caliper-bind-sut fabric --caliper-bind-sdk 1.4.1`

## Running

Once the network is up and all the physical machines have launched their containers for their peers a test can be performed. To run a test now simply run the command:

`npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmarks/samples/fabric/supplychain/config.yaml --caliper-networkconfig networks/fabric/fabric-v1.4.1/supplychain/samples/fabric-node-supplychain.yaml --caliper-flow-only-test`
