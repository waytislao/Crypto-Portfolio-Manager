import axios from 'axios';
import config from "config";

export const getLatestCryptoPrice = async (cryptoSymbol: string, currencyCode: string): Promise<number | null> => {
    const apiKey = config.get<string>('coinmarketcapApiKey');
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;

    try {
        const response = await axios.get(url, {
            params: {
                symbol: cryptoSymbol,
                convert: currencyCode
            },
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Accept': 'application/json'
            }
        });

        return response.data.data[cryptoSymbol].quote[currencyCode].price;
    } catch (error) {
        console.error('Error fetching cryptocurrency price:', error);
        return null;
    }
};
