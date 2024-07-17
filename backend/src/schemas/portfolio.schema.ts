import z, {number, object, string, TypeOf} from 'zod';
import {Currency, DefaultCurrencyCode} from "../utils/constants";

export const geePortfoliosSchema = object({
    query: object({
        currencyCode: z.enum(Currency, {required_error: 'Currency Code is required', message: 'Invalid Currency Code'})
    }),
});
export const createPortfolioSchema = object({
    body: object({
        cryptoSymbol: string({
            required_error: 'Crypto Symbol is required',
        }).toUpperCase(),
        quantity: number({
            required_error: 'Quantity is required',
        }).min(0),
    }),
});
export const updatePortfolioSchema = object({
    body: object({
        quantity: number({
            required_error: 'Quantity is required',
        }).min(0),
    }),
    params: object({
        cryptoSymbol: string({
            required_error: 'Crypto Symbol is required',
        }).toUpperCase(),
    }),
});
export const deletePortfolioSchema = object({
    params: object({
        cryptoSymbol: string({
            required_error: 'Crypto Symbol is required',
        }).toUpperCase(),
    }),
});

export type GetPortfoliosSchemaInput = TypeOf<typeof geePortfoliosSchema>['query'];
export type CreatePortfolioInput = TypeOf<typeof createPortfolioSchema>['body'];

export type UpdatePortfolioInput = TypeOf<typeof updatePortfolioSchema>['body'];
export type UpdatePortfolioParams = TypeOf<typeof updatePortfolioSchema>['params'];

export type DeletePortfolioParams = TypeOf<typeof deletePortfolioSchema>['params'];
