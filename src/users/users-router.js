const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

usersRouter
    .route('/')
    .get((req, res, next) => {
        //const knexInstance = req.app.get('db')
        res.send('yes')
    })

    module.exports = usersRouter
