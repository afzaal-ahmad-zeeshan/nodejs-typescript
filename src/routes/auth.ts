import express, { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Database from '../data/db';
import bcrypt from 'bcrypt';
const db = Database.getInstance();
const router = express.Router();

function isValid(user: User): boolean {
    return (
        !user.id &&
        user.username &&
        user.password &&
        user.deposit === 0 &&
        user.roles.length === 0
    );
}

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

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // check username

    // check password hash

    // generate token and send it
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

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
