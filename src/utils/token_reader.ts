import express from 'express';
const router = express.Router();
import Database from '../data/db';
import Token from '../models/token';
const db = Database.getInstance();

/**
 * isAuthenticated => used to check if the request is with a token
 * userId => the userId of the user to whom this token belongs
 *
 */
 router.all('*', async (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        res.locals.isAuthenticated = false;
        console.log(`[INFO] unauthorized request`);
    } else {
        res.locals.isAuthenticated = true;

        // fetch the userId
        const token: string = req.headers.authorization.toLowerCase().replace('bearer ', '');
        const tokenInstance: Token = db.tokens.find(t => t.token === token);

        if (tokenInstance) {
            if (new Date(tokenInstance.activeUntil) <= new Date()) {
                res.locals.isAuthenticated = false;
                console.log(`[INFO] unauthorized request with expired token`);
            } else {
                res.locals.userId = tokenInstance.userId;
                res.locals.token = token;
                console.log(`[INFO] authorized request with userId ${res.locals.userId}`);
            }
        } else {
            res.locals.isAuthenticated = false;
        }
    }
    next();
});

export default router;
