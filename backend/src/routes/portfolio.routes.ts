import express from 'express';
import {deserializeUser} from '../middleware/deserializeUser';
import {requireUser} from '../middleware/requireUser';
import {
    addCryptocurrencyToPortfolio,
    deletePortfolio,
    getPortfolio,
    updatePortfolio
} from "../controllers/portfolio.controller";
import {validateAndTransform} from "../middleware/validateAndTransform";
import {createPortfolioSchema, deletePortfolioSchema, updatePortfolioSchema} from "../schemas/portfolio.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get the current user's portfolio
router.get('/', getPortfolio);
router.post('/', validateAndTransform(createPortfolioSchema), addCryptocurrencyToPortfolio);
router.put('/:cryptoSymbol', validateAndTransform(updatePortfolioSchema), updatePortfolio);
router.delete('/:cryptoSymbol', validateAndTransform(deletePortfolioSchema), deletePortfolio);

export default router;
