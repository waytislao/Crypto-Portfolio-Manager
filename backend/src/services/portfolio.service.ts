import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const portfolioRepository = prisma.portfolio;
const cryptoRepository = prisma.crypto;

export const createPortfolio = async (userId: number, cryptoSymbol: string, quantity: number) => {
    const cryptoEntity = await cryptoRepository.upsert({
        where: {symbol: cryptoSymbol},
        update: {},
        create: {
            symbol: cryptoSymbol
        }
    });

    return portfolioRepository.create({
        data: {
            user_id: userId,
            crypto_id: cryptoEntity.id,
            quantity
        }
    });
};

export const findPortfoliosByUserId = (userId: number) => {
    return portfolioRepository.findMany({
        where: {
            user_id: userId
        },
        include: {
            crypto: true,
        },
    });
};

export const findPortfolioByUserIdAndCryptoSymbol = (userId: number, cryptoSymbol: string) => {
    return portfolioRepository.findFirst({
        where: {
            user_id: userId,
            crypto: {
                symbol: cryptoSymbol
            }
        }
    });
}

export const updatePortfolioByPortfolioId = async (portfolioId: number, quantity: number) => {
    return portfolioRepository.update({
        where: {
            id: portfolioId
        },
        data: {
            quantity,
            updated_at: new Date()
        }
    });
}

export const deletePortfolioByPortfolioId = async (portfolioId: number) => {
    return portfolioRepository.delete({
        where: {
            id: portfolioId
        }
    });
}