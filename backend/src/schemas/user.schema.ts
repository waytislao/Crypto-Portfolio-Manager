import {object, string, TypeOf} from 'zod';

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'Username is required',
        }),
        password: string({
            required_error: 'Password is required',
        })
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string({
            required_error: 'Please confirm your password',
        }),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});

export const loginUserSchema = object({
    body: object({
        username: string({
            required_error: 'Username address is required',
        }),
        password: string({
            required_error: 'Password is required',
        }).min(8, 'Invalid email or password'),
    }),
});

export type CreateUserInput = Omit<
    TypeOf<typeof createUserSchema>['body'],
    'passwordConfirm'
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
