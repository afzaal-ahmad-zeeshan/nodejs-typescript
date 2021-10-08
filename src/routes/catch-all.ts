import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({
        statusCode: 404,
        message: 'Not Found',
    });
});

export default router;
