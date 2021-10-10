export default {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express + TypeScript',
            description: 'This document outlines the API provided in the app.',
            version: '1.0.0',
            contact: {
                email: 'afzaal.ahmad.zeeshan@hotmail.com',
            },
            license: {
                name: 'MIT',
                url: 'https://github.com/afzaal-ahmad-zeeshan/nodejs-typescript',
            }
        },
        tags: [
            {
                name: 'auth',
                description: 'The authentication endpoints for user and account management.',
            },
            {
                name: 'users',
                description: 'The endpoints related to the users, such as deposit and reset.',
            },
            {
                name: 'products',
                description: 'The endpoints for management of products.',
            }
        ],
        host: 'http://localhost:3000',
        schemes: ['http'],
    },
    apis: ['**/routes/*.ts'], // files containing annotations as above
};
