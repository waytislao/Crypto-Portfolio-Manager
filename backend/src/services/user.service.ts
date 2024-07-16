import config from 'config';
import {signJwt} from '../utils/jwt';
import {PrismaClient, Users} from '@prisma/client';

const prisma = new PrismaClient();
const userRepository = prisma.users;

export const createUser = (input: Omit<Users, 'id'>) => {
    return userRepository.create({data: input});
};

export const findUserByEmail = ({username}: { username: string }) => {
    return userRepository.findFirst({where: {username}});
};

export const findUserById = (userId: number) => {
    return userRepository.findFirst({
        where: {
            id: userId
        }
    });
};

export const signTokens = async (user: Users) => {
    const access_token = signJwt({sub: user.id}, 'accessTokenPrivateKey', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({sub: user.id}, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return {access_token, refresh_token};
};
