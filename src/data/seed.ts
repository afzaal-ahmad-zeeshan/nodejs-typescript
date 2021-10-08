import Database from './db';
import User from '../models/user';
import Product from '../models/product';
const db = Database.getInstance();
import { v4 as v4 } from 'uuid';
import bcrypt from 'bcrypt';
import constants from './constants';
import { randomInt } from 'crypto';

// create 5 users
const users: User[] = [
    {
        id: v4(),
        username: 'john-doe',
        password: bcrypt.hashSync('I234S6789O', 10),
        deposit: 10,
        roles: [
            constants.Roles.Buyer,
        ],
    },
    {
        id: v4(),
        username: 'jane-doe',
        password: bcrypt.hashSync('I234S6789O', 10),
        deposit: 10,
        roles: [
            constants.Roles.Buyer,
        ],
    },
    {
        id: v4(),
        username: 'dohn-joe',
        password: bcrypt.hashSync('I234S6789O', 10),
        deposit: 10,
        roles: [
            constants.Roles.Buyer,
            constants.Roles.Seller,
        ],
    },
    {
        id: v4(),
        username: 'doe-jane',
        password: bcrypt.hashSync('I234S6789O', 10),
        deposit: 10,
        roles: [
            constants.Roles.Seller,
        ],
    },
    {
        id: v4(),
        username: 'dane-joe',
        password: bcrypt.hashSync('I234S6789O', 10),
        deposit: 10,
        roles: [
            constants.Roles.Seller,
        ],
    },
];

for (const user of users) {
    db.users.push(user);
}

// create 10 products
const products: Product[] = [
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(2, users.length)].id,
    },
    {
        id: v4(),
        productName: `Product ${v4()}`,
        cost: 5 * randomInt(1, 3),
        amountAvailable: randomInt(2, 5),
        sellerId: users[randomInt(users.length)].id,
    },
]

for (const product of products) {
    db.products.push(product);
}

console.log(`[INFO] seeded database with ${db.users.length} users and ${db.products.length} products...`);
