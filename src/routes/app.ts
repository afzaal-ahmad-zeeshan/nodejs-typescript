import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import Database from '../data/db';
const db = Database.getInstance();

router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.get('/db', (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT') {
        res.status(200).send({
            statusCode: 200,
            message: JSON.stringify(db),
        });
    } else {
        res.status(400).send({
            statusCode: 400,
            message: 'This endpoint will only work in local environment',
        });
    }
});

export default router;
