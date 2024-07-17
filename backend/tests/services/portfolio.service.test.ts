import { PrismaClient } from '@prisma/client';
import { createPortfolio, findPortfoliosByUserId } from "../../src/services/portfolio.service";

// Define mockPrismaClient before it's used in jest.mock
const mockPrismaClient = {
    portfolio: {
        create: jest.fn(),
        findFirst: jest.fn(),
    },
};

// Now mock '@prisma/client' with the previously defined mockPrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

describe('PortfolioService', () => {
    let prisma: PrismaClient;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPortfolio', () => {
        it('should create a new portfolio entry', async () => {
            const mockInput = { user_id: 1, crypto_id: 2, quantity: 100 };
            const mockOutput = { id: 1, ...mockInput };
            mockPrismaClient.portfolio.create.mockResolvedValue(mockOutput);

            const result = await createPortfolio(mockInput);

            expect(mockPrismaClient.portfolio.create).toHaveBeenCalledWith({ data: mockInput });
            expect(result).toEqual(mockOutput);
        });
    });

    describe('findPortfolioByUserId', () => {
        it('should find a portfolio by user ID', async () => {
            const userId = 1;
            const mockOutput = { id: 1, user_id: userId, crypto_id: 2, quantity: 100 };
            mockPrismaClient.portfolio.findFirst.mockResolvedValue(mockOutput);

            const result = await findPortfoliosByUserId(userId);

            expect(mockPrismaClient.portfolio.findFirst).toHaveBeenCalledWith({
                where: { user_id: userId },
            });
            expect(result).toEqual(mockOutput);
        });
    });
});