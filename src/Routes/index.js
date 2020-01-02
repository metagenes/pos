'use-strict';

const express = require('express'),
    product = require('./product'),
    category = require('./category'),
    order = require('./order'),
    user = require('./user'),
    {validateUser} = require('../Helpers/middleware');

const Router = express.Router();

Router.get('/', (req, res) => {
    res.json({
        message: "Point of Sale API"
    });
})


Router.use('/product', validateUser, product);
Router.use('/category', validateUser, category);
Router.use('/order', validateUser, order);
Router.use('/user', user);



module.exports = Router;