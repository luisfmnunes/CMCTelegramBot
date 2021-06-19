import axios from "axios";

const requestOptions = {
  method: 'get',
  url: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  params: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
  }
};

async function getAPI(){axios.request({
    method: 'get',
    url: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    params: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
    },
    headers: {
    'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
    }
})
.then(res => {
    console.log(res.data);
})};

export default getAPI;