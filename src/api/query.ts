import axios from "axios";
import dotenv from 'dotenv';

interface iPlatform{
    id: number
    name: string
    symbol: string
    slug: string
    token_address: string
}

interface iQuote{
    USD: iUSD
}

interface iUSD{
    price: number
    percent_change_1h: number
    percent_change_24h: number
    market_cap: number
}

interface CMC_Data{
    id: number
    name: string
    symbol: string
    slug: string
    cmc_rank: number
    num_market_pairs: number
    circulating_supply: number
    total_supply: number
    max_supply: number
    last_updated: string
    date_added: string
    quote: iQuote
    platform: iPlatform
};

let last_check: Date = new Date(Date.now() - 24000 * 3600);

const requestOptions = {
  method: 'get',
  url: 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  params: {
    'start': '1',
    'limit': '5000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
  }
};

async function getQuery(){
    let reply = await axios.request({
        method: 'get',
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        params: {
            'start': '1',
            'limit': '200',
            'convert': 'USD',
            'sort': 'date_added',
            'sort_dir': 'desc'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
        }
    });
    return reply.data;
}

async function checkNewTokens(){
    if(!last_check){
        last_check = new Date();
        return;
    }
    let res = await getQuery().catch(err => console.log(err));
    console.log(res.data.slice(0,4));
    let filter = res.data.filter( (token: CMC_Data) => ((new Date(token.date_added) > last_check) && token.platform.symbol == 'BNB'));
    if(filter.lenght)
        last_check = new Date(res.data.filter.reduce( (a: CMC_Data, b: CMC_Data) => a.date_added > b.date_added ? a : b).date_added + 1000*3600);
        console.log(last_check);
    return filter
}

function tokenString(name: string, symbol: string, price: number, mc: number, phour: number, pday: number, date: string, supply: number, contract: string): string{
    return `New Token Found on CMC! \n - Name: ${name}\n - Symbol ${symbol}\n - Price: ${price}\n - MarketCap: ${mc}\n - Percent Change (1h): ${phour}\n - Percent Change (24h): ${pday}\n - Added: ${new Date(date).toString()}\n - Total Supply: ${supply}\n - Contract: ${contract}`;
};
export {getQuery, tokenString, checkNewTokens, CMC_Data, iUSD, iQuote};