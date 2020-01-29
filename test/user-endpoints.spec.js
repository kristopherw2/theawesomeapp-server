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

describe('POST /api/users/login', () => {
    
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

describe(`Post /api/users/registration`, () => {
    context('User Validation', () => {
        
        beforeEach('insert users', () => {
            return db
            .insert(testUsers)
            .into('users')
        });

        const requiredFields = ['username', 'password', 'age', 'height'];
        
        const missingRequiredFields = ['username', 'password', 'age'];
        missingRequiredFields.forEach(field => {
            const  registerAttempt = {
                username: 'test username',
                password: 'test password',
                age: 34,
            }
        })
        console.log(missingRequiredFields)

        it(`responds with 400 error when missing a field`, () => {
            return supertest(app)
                .post('/api/users/registration')
                .send(missingRequiredFields)
                .expect(400, {
                    error: { message: `Missing '${requiredFields[3]}' in request body` }
                })
        });

        it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
            const userShortPassword = {
                username: 'testusername',
                password: '1234567',
                age: 34,
                height: 120,
            }
            return supertest(app)
                .post('/api/users/registration')
                .send(userShortPassword)
                .expect(400, { error: { message: "Password must be between 8 and 36 characters"} })
        });

        it(`responds 400 'Password must be between 8 and 36 characters' when password is greater than 36 characters`, ()  => {
            const longPassword = {
                username: 'testusername',
                password: 'a1'.repeat(37),
                age: 34,
                height: 120,
            }

            return supertest(app)
                .post('/api/users/registration')
                .send(longPassword)
                .expect(400, { error: { message: "Password must be between 8 and 36 characters"} })
        });

        it(`responds 400 error when password starts with spaces`, () => {
            const userPasswordStartsSpaces = {
                username: 'testuser',
                password: ' 12345678',
                age: 34,
                height: 120
            }

            return supertest(app)
                .post('/api/users/registration')
                .send(userPasswordStartsSpaces)
                .expect(400, { error: { message: "Password must not start with spaces"} } )
        })

        it(`responds 400 error when password starts with spaces`, () => {
            const userPasswordEndsSpaces = {
                username: 'testuser',
                password: '12345678 ',
                age: 34,
                height: 120
            }

            return supertest(app)
                .post('/api/users/registration')
                .send(userPasswordEndsSpaces)
                .expect(400, { error: { message: "Password must not start with spaces"} } )
        })

        it(`responds 400 error when password does not contain a digit`, () => {
            const userPasswordNoDigit = {
                username: 'testuser',
                password: 'abcdefghijk',
                age:34,
                height: 120
            };

            return supertest(app)
                .post('/api/users/registration')
                .send(userPasswordNoDigit)
                .expect(400, {error: { message: 'Password must be contain at least one digit'} })
        });

        it(`responds 400 'User name already taken' when username isn't unique`, () => {
            const duplicateUser = {
                username: testUser.username,
                password: "a1adwdwa",
                age: 34,
                height: 120
            }

            return supertest(app)
            .post('/api/users/registration')
            .send(duplicateUser)
            .expect(400, {error: {message: `Username already taken`} }
            )
        });
    });
});
