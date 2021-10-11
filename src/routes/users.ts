import express, { Request, Response, NextFunction } from 'express';
import constants from '../data/constants';
import Database from '../data/db';
import User from '../models/user';

const router = express.Router();
const db = Database.getInstance();

/**
 * @openapi
 * /api/users/:
 *   get:
 *     tags:
 *       - users
 *     description: Get the list of users in the system
 *     responses:
 *       200:
 *         description: Returns the list of users.
 */
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

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - users
 *     description: Get the user by their user ID.
 *     responses:
 *       200:
 *         description: Returns the user found by that user ID.
 */
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

/**
 * @openapi
 * /api/users/:
 *   post:
 *     tags:
 *       - users
 *     description: Placeholder endpoint. To create a new user, use the /api/auth/register endpoint.
 *     responses:
 *       301:
 *         description: Returns a redirect to the other endpoint.
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(301).send({
        statusCode: 301,
        message: 'Use the /api/auth/register endpoint to create users.',
    });
});

/**
 * @openapi
 * /api/users/deposit:
 *   post:
 *     tags:
 *       - users
 *     description: Deposits the amount to the active user's account.
 *     responses:
 *       200:
 *         description: Returns 'OK' and the current deposit value if successful.
 */
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

/**
 * @openapi
 * /api/users/reset:
 *   post:
 *     tags:
 *       - users
 *     description: Resets the deposit for the currently active user. Note that it resets the deposit to zero.
 *     responses:
 *       200:
 *         description: Returns 'OK' and current deposit if the account had been reset.
 */
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

/**
 * @openapi
 * /api/users/:
 *   put:
 *     tags:
 *       - users
 *     description: Updates the user's details in the account using the active userId.
 *     responses:
 *       200:
 *         description: Returns 'OK' if the user was updated.
 */
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

/**
 * @openapi
 * /api/users/{userId}:
 *   put:
 *     tags:
 *       - users
 *     description: Updates the user's details in the account using the userId in URL.
 *     responses:
 *       200:
 *         description: Returns 'OK' if the user has been updated.
 */
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

/**
 * @openapi
 * /api/users/:
 *   delete:
 *     tags:
 *       - users
 *     description: Deletes the user from the system using the active userId.
 *     responses:
 *       200:
 *         description: Returns 'OK' if the user has been deleted.
 */
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

/**
 * @openapi
 * /api/users/{userId}:
 *   delete:
 *     tags:
 *       - users
 *     description: Deletes the user from the system using userId from URL.
 *     responses:
 *       200:
 *         description: Returns 'OK' if the user has been deleted.
 */
router.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
    db.users = db.users.filter(user => user.id !== req.params.userId);
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
