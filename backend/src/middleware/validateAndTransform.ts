import {NextFunction, Request, Response} from 'express';
import {AnyZodObject, ZodError} from 'zod';

export const validateAndTransform =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsedInput = schema.parse({
                    params: req.params,
                    query: req.query,
                    body: req.body,
                });

                req.params = parsedInput.params;
                req.query = parsedInput.query;
                req.body = parsedInput.body;

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        status: 'fail',
                        errors: error.errors,
                    });
                }
                next(error);
            }
        };
