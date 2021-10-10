import express, { Request, Response, NextFunction } from 'express';
import constants from '../data/constants';
import Database from '../data/db';
import User from '../models/user';

const router = express.Router();
const db = Database.getInstance();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    let _users = [];
    for (let user of db.users) {
        _users.push({
            id: user.id,
            username: user.username,
            deposit: user.deposit,
            roles: user.roles,
        })
    }
    res.status(200).send({
        statusCode: 200,
        users: _users,
    });
});

router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
    const user = db.users.find(u => u.id === req.params.userId);
    res.status(200).send({
        statusCode: 200,
        user: {
            id: user.id,
            username: user.username,
            deposit: user.deposit,
            roles: user.roles,
        },
    });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(301).send({
        statusCode: 301,
        message: 'Use the /api/auth/register endpoint to create users.',
    });
});

router.post('/deposit', (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'This endpoint requires a valid token to deposit amount in.',
        });
        return;
    }
    let { deposit } = req.body;
    const index = db.users.findIndex(u => u.id.toLowerCase() === res.locals.userId.toLowerCase()); // lowercase, just in case

    // check the role
    let user = db.users[index];
    if (user.roles.filter(role => role === constants.Roles.Buyer).length === 0) {
        res.status(200).send({
            statusCode: 400,
            message: 'This endpoint can only be used by buyers.',
        });
        return;
    }

    // increment the deposit
    deposit = Number.parseInt(deposit);
    if ([ 5, 10, 20, 50, 100 ].indexOf(deposit) > -1) {
        user.deposit = user.deposit + Number.parseInt(deposit);
        db.users[index] = user;

        res.status(200).send({
            statusCode: 200,
            message: 'OK',
            deposit: db.users[index].deposit,
        });
    } else {
        res.status(200).send({
            statusCode: 400,
            message: 'Cannot process this deposit. You can deposit coins of 5, 10, 20, 50, or 100 only.',
        });
    }
});

router.post('/reset', (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'This endpoint requires a valid token to reset the deposit for.',
        });
        return;
    }
    const index = db.users.findIndex(u => u.id.toLowerCase() === res.locals.userId.toLowerCase()); // lowercase, just in case

    // check the role
    let user = db.users[index];
    if (user.roles.filter(role => role === constants.Roles.Buyer).length === 0) {
        res.status(200).send({
            statusCode: 400,
            message: 'This endpoint can only be used by buyers.',
        });
        return;
    }

    // resetting the deposit to zero.
    user.deposit = 0;
    db.users[index] = user;
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
        deposit: db.users[index].deposit,
    });
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'You are not authorized to perform this action.',
        });
        return;
    }

    const user: User = req.body;

    let index = db.users.findIndex(_ => _.id === req.params.userId);
    let u = db.users[index];
    for (let prop in user) {
        u[prop] = user[prop];
    }
    db.users[index] = u;
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.put('/:userId', (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;

    let index = db.users.findIndex(_ => _.id === req.params.userId);
    let u = db.users[index];
    for (let prop in user) {
        u[prop] = user[prop];
    }
    db.users[index] = u;
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.delete('/', (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'You are not authorized to perform this action.',
        });
        return;
    }
    db.users = db.users.filter(user => user.id !== res.locals.userId);
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
    db.users = db.users.filter(user => user.id !== req.params.userId);
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
