## QR Scanning

The goal of this component is to simulate what could happen in a real environment. There are some current limitations with the implementation and would not be quite like in a production system with issues that I will cover at the end of this Wiki.

This component provides the ability to scan a QR code which contains JSON data representing product information, that information once scanned is sent to a web server which then will request a transaction be submitted on behalf of the intended client (peer).

1. Download `https://play.google.com/store/apps/details?id=com.scanner.kataykin.icamesscaner.free&hl=en&showAllReviews=true` onto phone.

2. Use `ipconfig` or `ifconfig` depending on operating system to fetch your `inet` IP Address (IPv4) (Making sure that the phone and device that will run the server are on the same network, most likely will have problems with University network so would recommend hotspot or at home).

3. In the app downloaded from **step 1** click on the cog in the top right.

4. Choose `GET` and set the `server URL` to be `http://<IP_ADDRESS>:8081/scan` where IP_ADDRESS is the one fetched from **step 2**.

5. On the machine running the server, go to the directory `supplychain/javascript` and run `npm install express` if this is the first time running.

6. Now run `node server.js`

7. Scanning a QR code will now send data to this application where it will then be forwarded to execute a transaction. (Blockchain network must be running to perform the transactions).

## Creating QR Codes

Website used to embed JSON data in QR Codes:
`https://codesandbox.io/s/generate-qrcode-with-json-data-2jxn8`

## Examples
Also found in the `docs/qr codes` folder.

![QR Codes](https://i.imgur.com/YmtQZJ5.png)

## Issues

Currently all the information is encoded in the QR code, meaning that there are different QR codes for different stages in the supply chain as the QR code has embedded information such as `location` and `price`. Ideally, the QR code should simply identify the item (`name`, `gtin`, `amount`, etc). When the item is scanned (the same QR code each time) the phone app should act as the organisation for that part of the supply chain. Meaning, that the phone app should add the rest of the information to the request and authenticate that it is that peer.

Otherwise, the current solution means anyone can scan the QR code and anyone can send information to the server and as long as its in the right format it will issue a transaction. The phone could act as a  remote node in the network with each organisation logging into their own accounts on the app.