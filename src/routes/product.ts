import express, { Request, Response, NextFunction } from 'express';
import Database from '../data/db';
import Product from '../models/product';
const db = Database.getInstance();
import { v4 as v4} from 'uuid';
import constants from '../data/constants';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({
        statusCode: 200,
        products: db.products,
    });
});

router.get('/:productId', (req: Request, res: Response, next: NextFunction) => {
    const product = db.products.find(p => p.id === req.params.productId);

    if (product) {
        res.status(200).send({
            statusCode: 200,
            product: product,
        });
    } else {
        res.status(404).send({
            statusCode: 404,
            message: 'Product with this ID was not found.',
        });
    }
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!res.locals.isAuthenticated) {
            res.status(200).send({
                statusCode: 400,
                message: 'A valid token is required to create a product.',
            });
            return;
        }

        const user = db.users.find(u => u.id === res.locals.userId);
        if (user.roles.filter(role => role === constants.Roles.Seller).length === 0) {
            // user is not a seller
            res.status(200).send({
                statusCode: 400,
                message: 'You need to be a seller to create a product.',
            });
            return;
        }

        const product: Product = req.body;

        // in POST, we should provide the id
        product.id = v4();
        product.sellerId = res.locals.userId;

        // verify the user is a seller
        db.products.push(product);
        res.status(200).send({
            statusCode: 200,
            product: product,
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            isError: true,
            message: 'Something went wrong.',
        });
    }
});

router.post('/buy', (req: Request, res: Response, next: NextFunction) => {
    const { productId, amount } = req.body;

    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'You need to be authorized to perform this action.',
        });
        return;
    }

    // check if the user exists as a buyer
    const userIndex = db.users.findIndex(u => u.id === res.locals.userId);
    const user = db.users[userIndex];
    if (user.roles.filter(role => role === constants.Roles.Buyer).length === 0) {
        res.status(200).send({
            statusCode: 400,
            message: 'You need to be a buyer to buy products.',
        });
        return;
    }

    // find the product
    const productIndex = db.products.findIndex(p => p.id === productId);
    const product = db.products[productIndex];
    if (!product) {
        res.status(200).send({
            statusCode: 404,
            message: 'The product with this ID was not found.',
        });
        return;
    }

    // do we have enough items in inventory?
    if (amount > product.amountAvailable) {
        res.status(200).send({
            statusCode: 400,
            message: 'The current inventory does not have sufficient supply for products.',
        });
        return;
    }

    // can the user purchase this with their deposit?
    const cost = product.cost * amount;
    if (cost > user.deposit) {
        res.status(200).send({
            statusCode: 400,
            message: 'You do not have enough deposit to execute this transaction.',
        });
        return;
    }

    // buy the products
    product.amountAvailable -= amount;
    db.products[productIndex] = product;

    user.deposit -= cost;
    db.users[userIndex] = user;
    res.status(200).send({
        statusCode: 200,
        receipt: {
            product: product,
            amount: amount,
            cost: cost,
            change: user.deposit,
        },
    });
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    // validate the token
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'This endpoint requires a valid token to operate.',
        });
        return;
    }

    const product: Product = req.body;
    if (!product.id) {
        res.status(200).send({
            statusCode: 400,
            message: 'The ID of the product must be supplied.',
        });

        return;
    }

    // check if the person is a seller
    let user = db.users.find(u => u.id === res.locals.userId);
    if (user.roles.filter(role => role === constants.Roles.Seller).length === 0) {
        // user is not a seller
        res.status(200).send({
            statusCode: 400,
            isError: true,
            message: 'You need to be a seller to manage products.',
        });
        return;
    }
    let index = db.products.findIndex(_ => _.id === product.id);
    let p = db.products[index];

    if (!p) {
        res.status(200).send({
            statusCode: 404,
            message: 'The product with this ID was not found.',
        });
        return;
    }

    // verify if the seller is making changes, or someone else
    if (user.id !== p.sellerId) {
        res.status(200).send({
            statusCode: 400,
            message: 'You are not the seller for this product.',
        });
        return;
    }

    // update the only fields that were passed.
    for (let prop in product) {
        p[prop] = product[prop];
    }

    db.products[index] = p;
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.delete('/:productId', (req: Request, res: Response, next: NextFunction) => {
    // check the token
    if (!res.locals.isAuthenticated) {
        res.status(200).send({
            statusCode: 400,
            message: 'You cannot perform this operation.',
        });
        return;
    }

    // validate that the user is a seller
    const user = db.users.find(u => u.id === res.locals.userId);
    if (user.roles.filter(role => role === constants.Roles.Seller).length === 0) {
        res.status(200).send({
            statusCode: 400,
            message: 'You need to be a seller to manage products.',
        });
        return;
    }

    // validate if the user is seller for this product
    const index = db.products.findIndex(p => p.id === req.params.productId);
    if (user.id !== db.products[index].sellerId) {
        res.status(200).send({
            statusCode: 400,
            message: 'You are not the seller for this product.',
        });

        return;
    }

    // remove the product
    db.products = db.products.filter(p => p.id !== req.params.productId);

    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
