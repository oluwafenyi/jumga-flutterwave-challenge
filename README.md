# Flutterwave Developer Challenge: < Project Jumga >
&nbsp;
  We've built this web application in line with the competition directives to show how easy it is to set up
payments with the [Flutterwave v3 API](https://developer.flutterwave.com/docs). Jumga is an e-commerce platform
that takes full advantage of Flutterwave's Subaccounts system to set up easy payments for merchants and their
couriers.

We've had too much fun building this, and we'd like to take you briefly through our thoughts and creative process.

* We started out "professionally" with a meeting and some [presentation slides](https://docs.google.com/presentation/d/1Ni57y-jUsqiT2CG8hUAakNgjnAEE8SAbUWWXXoUbA9Q/edit?usp=sharing) to discuss the direction the
project would take.
  
* We mapped out rough sketches for flows for certain processes like [merchant registration](https://drive.google.com/file/d/1KmT1B0g6B0D_9HA5G2gNe1YGS5pPGHnE/view) and [order placement](https://drive.google.com/file/d/1PJbVt04PR7DsJeJXWUbBFUJS3Coe7iow/view?usp=sharing).

* We came up with a [design](https://www.figma.com/file/uZV4UBjwslqdmCI13KshlG/Project-Jumga) we really like.

A lot of things changed but this was a great method to set us on our way.

&nbsp;
## Technologies
The client-side of this application is built with React and configured as a PWA and the server-side is build with Go, both firsts for us
as we looked to add a meta challenge. We use a PostgreSQL database to store application data and we used Docker
as our local development environment to keep things consistent for collaboration purposes, starting this up locally is as 
easy as running ```docker-compose up``` in the root directory.

We also took the liberty of deploying this in staging just in case, with the [main](https://jumga-client.netlify.app/) and [merchant](https://jumga-merchant.netlify.app/) portals hosted with Netlify
and the [backend](https://apex-jumga.herokuapp.com/) hosted with Heroku.

&nbsp;
## API Documentation
Click [here](https://documenter.getpostman.com/view/10335756/TVzXBaaC) to see the documentation for the server-side endpoints.

&nbsp;
## Ways we used the Flutterwave V3 API
* Banks resource for form input selection on the frontend.
* Bank account verification to validate account details input.
* Flutterwave Standard to initiate payments.
* Transaction verification to verify payments before value is given to the customer.
* Subaccounts to set up dispatch and merchant accounts and split payments easily.

&nbsp;
## Competition Directive Checklist
- [x] Merchants can create shops on Jumga.
- [x] Each shop is assigned a dispatch rider > We allowed stores register their riders, no store would be allowed to list products
for sale without approval or a registered rider.
- [x] Each shop can collect payments from Ghana, Nigeria, Kenya and UK.
- [x] Each shop created on Jumga pays a token of \$20 to Jumga, once payment is confirmed, the shop will be approved. > Merchants
  can create their accounts but will not be able to perform any actions until approval is processed. Merchant subaccount is created on
  approval.
- [x] Every sale will be split according to the appropriate percentages between Jumga, the shop owner (merchant) and the dispatch rider. >
We achieved this using the ```flat_subaccount``` charge type for split payment during payment initiation. Jumga takes a
  25% on all delivery fees and 2.5% on all product fees.

&nbsp;
## How to Run this on your Local Machine?
We recommend you use Docker, clone this repository, edit the docker-compose.yml file with your own Flutterwave Test API Key
and run ```docker-compose up``` in the root directory of the cloned repository.
If you don't have docker installed you may proceed running the client, merchant-client and server applications in different shells.
You would need to have ```Golang >=v15``` installed, a postgres server running, as well as ```node.js```.

When you have everything running, the client app should be visible on port :3000, the merchant on :8080 and the server on :8000

### Database Setup
Set up your database and replace these lines in the /server/globals/globals.go file with your database credentials.

    DBOpts = &pg.Options{
      User:     "postgres",
      Password: "password",
      Database: "postgres", // database name
      Addr:     "db:5432",  // hostname:port
    }

### Running Client and Merchant Client
* cd into directory
* run ```npm install```
* run ```npm start```

be sure to run client on port ```:3000``` and merchant-client on port ```:8080```.

### Running Server
    # set environment variables FLUTTERWAVE_API_KEY and TOKEN_AUTH_SECRET
    # FLUTTERWAVE_API_KEY is the secret key gotten from your flutterwave dashboard
    # TOKEN_AUTH_SECRET is any arbitrary secret key
    > cd server
    > go build
    > ./server

```./server.exe``` on windows

server runs on port ```:8000```

