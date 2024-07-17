import {number, object, string, TypeOf} from 'zod';

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

export type CreatePortfolioInput = TypeOf<typeof createPortfolioSchema>['body'];

export type UpdatePortfolioInput = TypeOf<typeof updatePortfolioSchema>['body'];
export type UpdatePortfolioParams = TypeOf<typeof updatePortfolioSchema>['params'];

export type DeletePortfolioParams = TypeOf<typeof deletePortfolioSchema>['params'];
