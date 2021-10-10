import express, { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Database from '../data/db';
import bcrypt from 'bcrypt';
import Token from '../models/token';
import { v4 } from 'uuid';
const db = Database.getInstance();
const router = express.Router();

function isValid(user: User): boolean {
    return (
        !user.id &&                         // user is should not be supplied
        user.username &&                    // username should be supplied
        user.password &&                    // password should be supplied
        user.deposit === 0 &&               // deposit should be 0 initially
        user.roles.length !== 0             // roles should not be empty
    );
}

/**
 * @openapi
 * /api/auth/tokens:
 *   get:
 *     tags:
 *       - auth
 *     description: Get the tokens for signed in user using their token.
 *     responses:
 *       200:
 *         description: Returns the tokens for the active user.
 */
router.get('/tokens', (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.isAuthenticated) {
        const tokens = db.tokens.filter(t => t.userId === res.locals.userId);
        res.status(200).send({
            statusCode: 200,
            tokens: tokens,
        });
    } else {
        res.status(403).send({
            statusCode: 403,
            isError: true,
            message: 'You need to send a valid token for this request to function.',
        });
    }
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - auth
 *     description: Register a user to the system.
 *     responses:
 *       200:
 *         description: Returns 'OK' if user has been registered.
 *       400:
 *         description: Returns an error if the model is not valid.
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    var user: User = req.body;

    // ensure model is valid
    if (!isValid(user)) {
        res.status(400).send({
            statusCode: 400,
            isError: true,
            message: 'The user model is not valid.',
        });

        return;
    }

    // hash the password
    user.password = await bcrypt.hash(user.password, 10);
    db.users.push(user);
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     description: Login the user with their username and password.
 *     responses:
 *       200:
 *         description: Returns the token for the user if the details are correct.
 *       404:
 *         description: Returns error if the username or password was incorrect.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // check username
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

    // check password hash
    if (!user || !await bcrypt.compare(password, user.password)) {
        res.status(200).send({
            statusCode: 404,
            message: 'Username or password was incorrect.',
        });
        return;
    }

    // generate token and send it
    const token: Token = {
        id: v4(),
        token: v4(),
        userId: user.id,
        activeUntil: (new Date(new Date().getTime() + 30 * 60000)).toISOString()     // 30 minutes from now
    }

    db.tokens.push(token);
    res.status(200).send({
        statusCode: 200,
        token: token,
    });
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     description: Clear the token from the system.
 *     responses:
 *       200:
 *         description: Returns 'OK' if the token has been cleared.
 */
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.isAuthenticated) {
        db.tokens = db.tokens.filter(t => t.token !== res.locals.token);
    }
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
