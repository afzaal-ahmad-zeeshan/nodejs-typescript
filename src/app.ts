import express from 'express';

// configs
const app = express();
const port = 3000;
import morgan from 'morgan';
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// read the token and attach details to HTTP context
import tokenReader from './utils/token_reader';
app.use('*', tokenReader);

// swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './swagger.config';
const spec = swaggerJsdoc(config);
app.use('/swagger.json', swaggerUi.serve, swaggerUi.setup(spec));

// routes
import usersRoute from './routes/users';
import authRoute from './routes/auth';
import productRoute from './routes/product';
import appRoute from './routes/app';
import catchAllRoute from './routes/catch-all';
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/app', appRoute);

// catch-all
app.use('*', catchAllRoute);

import './data/seed';
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}.`);
});
