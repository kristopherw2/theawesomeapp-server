const UsersService = require('../src/users/users-service')
const knex = require('knex')
const { makeUsersArray } = require('./users.fixtures')

let db;


let testUsers = makeUsersArray();

before(() => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL
    })
});

before(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

afterEach(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

after(() => db.destroy());

context('Given users table has data', () => {
    beforeEach(() => {
        return db
            .into('users')
            .insert(testUsers)
    });

    it.only('getUserByUsernamePassword() resolves users with username age height', () => {
        const testUserName = 'firstuser';
        const testUserPassword = 'password1'
        const expectedUser = {
                username: 'firstuser',
                age: 35,
                height: 70
        }
        return UsersService.getUserByUsernamePassword(db, testUserName, testUserPassword)
        .then((actual) => {
            console.log(`This is ${actual[0].username}`)
            expect(actual[0]).to.eql(expectedUser);
        })
    })
})