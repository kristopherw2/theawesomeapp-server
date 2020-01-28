const { expect } = require('chai');
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')

let db

const testUsers = makeUsersArray();
const testUser = testUsers[0]

before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
    app.set('db', db);
});

//truncate all tables due to FK restraints before each test
before(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

//truncate after each test to keep tables clean
afterEach(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

after('disconnect from db', () => db.destroy());

describe.only('POST /api/users/login', () => {
    console.log(testUsers)
    
    beforeEach('insert testUsers', () => {
        return db
        .insert(testUsers)
        .into('users')
    });

    


    it(`Responds with 400 required error when a field is missing`, () => {
        const requiredFields = ['username', 'password']
    
    //     requiredFields.forEach(field => {
    //     const loginAttemptBody = {
    //         username: testUser.username,
    //         password: testUser.password,
    //     }
    // });
    console.log(requiredFields)
        //delete loginAttemptBody[field]

        return supertest(app)
            .post('/api/users/login')
            .send(requiredFields)
            .expect(400), {error: `Missing a field in request body`}
    });

    it(`responds 400 'invalid username or password' when bad username`, () => {
        const userInvalidUser = { username: 'user-not', password: 'existy'}

        return supertest(app)
        .post('/api/users/login')
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect username or password` })
    })

    it(`responds 400 'invalid username or password' when bad password`, () => {
        const userInvalidUser = { username: 'user-not', password: 'existy'}

        return supertest(app)
            .post('/api/users/login')
            .send(userInvalidUser)
            .expect(400, {error: `Incorrect username or password`})
    })

    it(`responds 200 and valid usercreds when valid credentials`, () => {
        console.log(testUser)
        
        const userValidCreds = {
            username: testUser.username,
            password: testUser.password
        };

        const expectedResponse = {
            username: testUser.username,
            id: testUser.id
        }
        
        return supertest(app)
        .post('/api/users/login')
        .send(userValidCreds)
        .expect(200, expectedResponse)
    })
});