import {CookieOptions, NextFunction, Request, Response} from 'express';
import config from 'config';
import {CreateUserInput, LoginUserInput} from '../schemas/user.schema';
import {createUser, findUserByEmail, signTokens,} from '../services/user.service';
import AppError from '../utils/appError';
import {signJwt, verifyJwt} from '../utils/jwt';
import bcrypt from "bcryptjs";

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
        Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};

export const registerUserHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {password, username} = req.body;

        const user = await createUser({
            username: username.toLowerCase(),
            password: await bcrypt.hash(password, 12),
        });

        res.status(201).json({
            status: 'success',
            data: {
                user: {username: user.username, id: user.id},
            },
        });
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'User with that username already exist',
            });
        }
        next(err);
    }
};

export const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {username, password} = req.body;
        const user = await findUserByEmail({username});
        //1. Check if user exists and password is valid
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError(400, 'Invalid username or password'));
        }

        // 2. Sign Access and Refresh Tokens
        const {access_token, refresh_token} = await signTokens(user);

        // 3. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // 4. Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    } catch (err: any) {
        next(err);
    }
};

export const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        const message = 'Could not refresh access token';

        if (!refresh_token) {
            return next(new AppError(403, message));
        }

        // Validate refresh token
        const decoded = verifyJwt<{ sub: string }>(
            refresh_token,
            'refreshTokenPublicKey'
        );

        if (!decoded) {
            return next(new AppError(403, message));
        }

        // Sign new access token
        const access_token = signJwt({sub: decoded.sub}, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        });

        // Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    } catch (err: any) {
        next(err);
    }
};

const logout = (res: Response) => {
    res.cookie('access_token', '', {maxAge: 1});
    res.cookie('refresh_token', '', {maxAge: 1});
    res.cookie('logged_in', '', {maxAge: 1});
};

export const logoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logout(res);

        res.status(200).json({
            status: 'success',
        });
    } catch (err: any) {
        next(err);
    }
};
