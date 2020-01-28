const { expect } = require('chai');
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')

let db

const testUsers = makeUsersArray();

before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
    app.set('db', db);
});

//truncate all tables due to FK restraints before each test
before(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises monsters RESTART IDENTITY CASCADE')
});

//truncate after each test to keep tables clean
afterEach(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

after('disconnect from db', () => db.destroy());

describe('GET /api/users', () => {
    context('given there are users in the database', () => {
        beforeEach('insert users', () => {
            return db
            .insert(testUsers)
            .into('users')
        })

        it(`GET /api/users responds with 200 and user information`, () => {
            return supertets(app)
                .get('/api/users/:username&:password')
        })
    })
})