Mesh Portal JS
This application provides sample code that showcases  Mesh Link, Mesh RESTful APIs and the WAAS platform, Portal

The application was built using React, NEXT JS (for Server side), and TailWind CSS.

Requires Node.js 16.x+

Clone the repo git clone https://github.com/FrontFin/mesh-portal-js.git Getting started Init via npm:

cd mesh-portal-js npm install

Access credentials
Navigate to the Mesh Dashboard Settings page and pull the API credentials:

https://dashboard.meshconnect.com/company/keys


Navigate to Portal Dashboard to grab API keys:

https://app.portalhq.io/settings

Click 'New Test Client API Key' and copy both values

### Set environment variables:

##### Add the following environment variables to a .env file in base of the repository:

```bash
//Portal Credentials
NEXT_PUBLIC_PORTAL_API_KEY={{your api key }} #HINT: contains dashes in key
NEXT_PUBLIC_PORTAL_CLIENT_KEY={{your end users client identifier}} 

//RPC Provider Credentials
NEXT_PUBLIC_MAINNET_GATEWAY_URL={{your Mainnet RPC GATEWAY host with key in path (i.e., Infura)}}
NEXT_PUBLIC_GOERLI_GATEWAY_URL={{your Goerli RPC GATEWAY host with key in path (i.e., Infura)}}


//Mesh Credentials


NEXT_PUBLIC_MESH_API_URL=https://integration-api.getfront.com
MESH_API_URL=https://integration-api.getfront.com
MESH_API_KEY={{{Mesh API Secret Key}}}
MESH_CLIENT_ID={{Mesh API Key}}
NEXT_PUBLIC_MESH_NETWORK_ADDRESS=e3c7fdd8-b1fc-4e51-85ae-bb276e075611 // this is only for ETH.  To change, call our GET networks endpoint https://docs.meshconnect.com/reference/get_api-v1-transfers-managed-networks


#Withdrawal Credentials (change as you see fit.)
NEXT_PUBLIC_CHAIN=ethereum
NEXT_PUBLIC_SYMBOL=ETH

```



Validate the values contained in the .env file:

```bash
source .env 
echo NEXT_PUBLIC_CLIENT_ID 
```
##### Create .npmrc file and add the following:

```bash

@portal-hq:registry=https://registry.npmjs.org
//registry.npmjs.org/:_authToken={{your NPM Auth Token}}
```
Run the application:

```bash
npm run dev
 ```

Navigate to localhost:{{yourPort}}. You should see the app running.

Generate a build npm run build