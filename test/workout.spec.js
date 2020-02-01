const { expect } = require('chai')
const knex = require('knex') 
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeWorkoutsArray } = require('./workout.fixtures')
const { makeExercisesArray } = require('./exercise-fixtures')

let db;

const testUsers = makeUsersArray();
const testWorkouts = makeWorkoutsArray();
const testExercises = makeExercisesArray();

before(() => {
    db = knex ({
        client: "pg",
        connection: process.env.TEST_DATABASE_URL
    })
})

before(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

afterEach(() => {
    return db.raw('TRUNCATE TABLE users, workouts, exercises RESTART IDENTITY CASCADE')
});

after(`Disconnect from db`, () =>db.destroy());

describe.only(`GET /api/workouts`, () => {
    
    beforeEach(`insert users, workouts, and exercises`, () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db
            .into('workouts')
            .insert(testWorkouts)
            .then(() => {
                return db
                .into('exercises')
                .insert(testExercises)
            })
        })
    });

    context(`Given there are workouts in the database`, () => {

        it(`returns a respons`, () => {
            return supertest(app)
            .get('/api/workouts')
            .expect('Workouts is working')
        });
    });
});