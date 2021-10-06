import express, { Request, Response, NextFunction } from 'express';
import Database from '../data/db';
import Product from '../models/product';
const db = Database.getInstance();
import { v4 as v4} from 'uuid';

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
        const product: Product = req.body;

        // in POST, we should provide the id
        product.id = v4();

        // verify the user is a seller
        db.products.push(product);
        res.status(200).send({
            statusCode: 200,
            message: 'OK',
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
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.body;
    console.log(`[INFO] patch: ${JSON.stringify(req.body)}`);
    if (!product.id) {
        res.status(400).send({
            statusCode: 400,
            message: 'The ID of the product must be supplied.',
        });

        return;
    }

    let index = db.products.findIndex(_ => _.id === product.id);
    let p = db.products[index];
    console.log(`initial: ${JSON.stringify(db.products[index])}`);

    // update the only fields that were passed.
    for (let prop in product) {
        p[prop] = product[prop];
    }

    db.products[index] = p;
    console.log(`updated: ${JSON.stringify(db.products[index])}`);
    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

router.delete('/:productId', (req: Request, res: Response, next: NextFunction) => {
    db.products = db.products.filter(p => p.id !== req.params.productId);

    res.status(200).send({
        statusCode: 200,
        message: 'OK',
    });
});

export default router;
