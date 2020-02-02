const { expect } = require('chai')
const knex = require('knex') 
const app = require('../src/app')
const WorkoutServices = require('../src/workouts/workouts-services')
const { makeUsersArray } = require('./users.fixtures')
const { makeWorkoutsArray } = require('./workout.fixtures')
const { makeExercisesArray } = require('./exercise.fixtures')

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

describe(`GET /api/workouts`, () => {
    
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

        it(`returns a response`, () => {
            return supertest(app)
            .get('/api/workouts')
            .expect('Workouts is working')
        });
    });
});

describe(`GET /api/workouts/user/:user_id`, () => {

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
        
        it.only(`returns a workout based on User ID`, () => {
            const userId = 2;
            const expectedResponse = [ 
                { workoutid: 5, workoutname: '1-21-20', userid: 2 },
                { workoutid: 6, workoutname: '1-22-20', userid: 2 },
                { workoutid: 7, workoutname: '1-23-20', userid: 2 },
                { workoutid: 8, workoutname: '1-24-20', userid: 2 } 
            ];


            return supertest(app)
            .get(`/api/workouts/user/${userId}`)
            .expect(expectedResponse)
            // return WorkoutServices.getWorkoutByUserId(db, userId)
            //     .then(actual => {
            //         expect(actual).to.eql(expectedResponse)
            //     })
        });
    });
});