import express, { Request, Response, NextFunction } from 'express';
import Database from '../data/db';

const router = express.Router();
const db = Database.getInstance();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(db.users);
    res.status(200).send({
        statusCode: 200,
        users: db.users,
    });
});

router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
    const user = db.users.find(u => u.id === req.params.userId);
    res.status(200).send({
        statusCode: 200,
        user: user,
    });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.post('/deposit', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.post('/reset', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.delete('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
