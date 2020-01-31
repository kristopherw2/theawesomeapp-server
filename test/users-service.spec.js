const UsersService = require('../src/users/users-service')
const knex = require('knex')
const { makeUsersArray } = require('./users.fixtures')

let db;


let testUsers = makeUsersArray();

before(() => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
    })
});

before(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

afterEach(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

after(() => db.destroy());