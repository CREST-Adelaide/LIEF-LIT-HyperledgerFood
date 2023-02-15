//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http')
const write = require('./writeTransaction.js');
const read = require('./readTransaction.js');

// define the Express app
const app = express();

const server = http.createServer(app);

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// handles what transaction to submit
function execute(product) {
	if (product.hasOwnProperty('name')) {
    	// if the product details are listed
    	write.writeProduct(product);
    } else if (product.hasOwnProperty('gtin')) {
    	// if only gtin then query that product
    	read.readProduct(product);
    } else {
    	console.log("unknown object action");
    }
}

app.get('/scan', function(req, res) {
    var json_data = req.query.text;
    json_data = JSON.parse(json_data);
    console.log(json_data);

    execute(json_data);
    res.status(200).send("Product Received!");    
});

// start the server
server.listen(8081, () => console.log(`Listening on port 8081`));
	