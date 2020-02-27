const { expect } = require('chai')
const knex = require('knex') 
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeWorkoutsArray } = require('./workout.fixtures')
const { makeExercisesArray } = require('./exercise.fixtures')
const jwt = require('jsonwebtoken')

let db;

const testUsers = makeUsersArray();
const testWorkouts = makeWorkoutsArray();
const testExercises = makeExercisesArray();

//creates auth header for tests
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    return `bearer ${token}`
}

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

describe(`GET /api/exercises/:workoutid`, () => {

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
    
    context(`Given there are exercises in the database`, () => {

        it(`Gets the exercise based on workoutId`, () => {
            const workoutIdToFind = 1
            const expectedResponse = [{
                exerciseid: 1,
                exercisename: "bench-press",
                sets: "3",
                repetitions: "10",
                exerciseweight: 200,
                time: 120,
                caloriesburned:100,
                workoutid: 1,
                userid: 1
            }]

            return supertest(app)
            .get(`/api/exercises/${workoutIdToFind}`)
            .set('authorization', makeAuthHeader(testUsers[0]))
            .expect(expectedResponse)
        });
    });
});

describe(`GET /api/exercises/user/userslices`, () => {

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
    
    context(`Given there are exercises in the database`, () => {

        it(`Gets the exercise based on userId`, () => {
            const expectedResponse = [{
                exerciseid: 1,
                exercisename: "bench-press",
                sets: "3",
                repetitions: "10",
                exerciseweight: 200,
                time: 120,
                caloriesburned:100,
                workoutid: 1,
                userid: 1
            }]

            return supertest(app)
            .get(`/api/exercises/user/userslices`)
            .set('authorization', makeAuthHeader(testUsers[0]))
            .expect(expectedResponse)
        });
    });
});

describe(`POST /api/exercises/create`, () => {

    beforeEach(`insert users, workouts, and exercises`, () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db
            .into('workouts')
            .insert(testWorkouts)
        })
    });


    it(`creates a new workout and responds with 201 and a new workout`, () => {
        const newExercise = {
            exercisename: "clean",
            sets: 3,
            repetitions: 10,
            exerciseweight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 4,
            userid: 1
        }

        return supertest(app)
        .post(`/api/exercises/create`)
        .send(newExercise)
        .set('authorization', makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
            expect(res.body[0].exercisename).to.eql(newExercise.exercisename)
            expect(res.body[0]).to.have.property('exerciseid')
            expect(res.headers.location).to.eql(`/api/exercises/create/${res.body[0].workoutid}`)
        })
        .then(postRes => {
            supertest(app)
            .get(`/api/exercises/${postRes.body[0].workoutid}`)
            .expect(postRes.body[0])
        })
    });
});

describe(`DELETE /api/exercises/:exerciseid`, () => {

    beforeEach(`insert users, workouts, and exercises`, () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
            return db
            .into('workouts')
            .insert(testWorkouts)
        })
    });


    context(`Given there are exercises in the database`, () => {

        it(`Deletes the exercise and returns 204 and exersice deleted`, () => {
            const idToRemove = 1
            return supertest(app)
                .delete(`/api/workouts/${idToRemove}`)
                .set('authorization', makeAuthHeader(testUsers[0]))
                .expect(204)
                .then(() => {
                    return supertest(app)
                    .get(`/api/exercises/${idToRemove}`)
                    .set('authorization', makeAuthHeader(testUsers[0]))
                    .expect([])
                })
        })
    })
})