import {NextFunction, Request, Response} from 'express';
import {
    createPortfolio,
    deletePortfolioByPortfolioId,
    findPortfolioByUserIdAndCryptoSymbol,
    findPortfoliosByUserId,
    updatePortfolioByPortfolioId
} from "../services/portfolio.service";
import {
    CreatePortfolioInput,
    DeletePortfolioParams,
    UpdatePortfolioInput,
    UpdatePortfolioParams
} from "../schemas/portfolio.schema";
import {getLatestCryptoPrice} from "../clients/coinmarketcap.client";
import {commonConstants, DefaultCurrencyCode, errorConstants} from "../utils/constants";

export const getPortfolio = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const portfolios = await findPortfoliosByUserId(res.locals.user.id)

        res.status(200).status(200).json({
            status: commonConstants.Status.Success,
            data: {
                portfolios,
            },
        });

    } catch (err: any) {
        next(err);
    }
};

export const addCryptocurrencyToPortfolio = async (
    req: Request<{}, {}, CreatePortfolioInput>,
    res: Response,
    next: NextFunction
) => {
    const {cryptoSymbol, quantity} = req.body;
    const existingPortfolio = await findPortfolioByUserIdAndCryptoSymbol(res.locals.user.id, cryptoSymbol);
    if (existingPortfolio) {
        return res.status(409).json({
            status: commonConstants.Status.Fail,
            message: errorConstants.Portfolio.PortfolioAlreadyExist,
        });
    }

    const latestPrice = await getLatestCryptoPrice(cryptoSymbol, DefaultCurrencyCode);
    if (latestPrice === null) {
        return res.status(404).json({
            status: commonConstants.Status.Fail,
            message: errorConstants.Portfolio.CyptoSymbolNotFound,
        });
    }

    const createdPortfolio = await createPortfolio(res.locals.user.id, cryptoSymbol, quantity);

    res.status(201).json({
        status: commonConstants.Status.Success,
        data: {
            createdPortfolio
        },
    });
};

export const updatePortfolio = async (
    req: Request<UpdatePortfolioParams, {}, UpdatePortfolioInput>,
    res: Response,
    next: NextFunction
) => {
    const {cryptoSymbol} = req.params;
    const {quantity} = req.body;

    const existingPortfolio = await findPortfolioByUserIdAndCryptoSymbol(res.locals.user.id, cryptoSymbol);
    if (!existingPortfolio) {
        return res.status(404).json({
            status: commonConstants.Status.Fail,
            message: errorConstants.Portfolio.PortfolioNotFound,
        });
    }

    const updatedPortfolio = await updatePortfolioByPortfolioId(existingPortfolio.id, quantity);

    res.status(200).json({
        status: commonConstants.Status.Success,
        data: {
            updatedPortfolio
        },
    });
}

export const deletePortfolio = async (
    req: Request<DeletePortfolioParams>,
    res: Response,
    next: NextFunction
) => {
    const {cryptoSymbol} = req.params;

    const existingPortfolio = await findPortfolioByUserIdAndCryptoSymbol(res.locals.user.id, cryptoSymbol);
    if (!existingPortfolio) {
        return res.status(404).json({
            status: commonConstants.Status.Fail,
            message: errorConstants.Portfolio.PortfolioNotFound,
        });
    }

    await deletePortfolioByPortfolioId(existingPortfolio.id);

    res.status(204).json({
        status: commonConstants.Status.Success,
    });
}
