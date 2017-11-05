
const got = require('got');

const tokenAddress = '0x0C04d4f331DA8dF75f9E2e271E3f3F1494C66C36';
const apiKey = process.env.ETHERSCAN_API_KEY;

const apiEndpoint = (tokenAddress, apiKey) =>
`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${tokenAddress}&apikey=${apiKey}`

got(apiEndpoint(tokenAddress, apiKey), {json: true}).then(response => {
  console.log(response.body.result);
})
.catch(error => {
  console.error(error.response);
});
