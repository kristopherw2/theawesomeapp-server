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

describe(`GET /api/workouts/:workout_id`, () => {
    
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

    context(`There are workouts in the database`, () => {

        it(`returns workouts by id`, () => {
            const idToFind = 2
            const expectedResponse = [{
                workoutid: 2,
                workoutname: "1-22-20",
                userid: 1
            }];

            return supertest(app)
                .get(`/api/workouts/${idToFind}`)
                .expect(expectedResponse)
        });
    });

});

describe(`DELETE /api/workouts/:workout_id`, () => {
    
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

    context(`There are workouts in the database`, () => {
        it(`Responds 204 and deletes workout`, () => {
            const idToRemove = 2
            const expectedResponse = testWorkouts.filter(workout => workout.workoutid !== idToRemove)
            return supertest(app)
                .delete(`/api/workouts/${idToRemove}`)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/workouts/${idToRemove}`)
                    .expect([])
                    )
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
        
        it(`returns a workout based on User ID`, () => {
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
        });

    });

    context(`Given there are no workouts in the database`, () => {
        it(`200 and an empty array`, () => {
            const userId = 12345

            return supertest(app)
                .get(`/api/workouts/user/${userId}`)
                .expect(200, [])
        });
    });
});

describe(`DELETE /api/workouts/:workout_id`, () => {
    context(`Give there are workouts in the database`, () => {

        it(`responds with 204 and removes the workout`, () => {
            const idToRemove = 2
            const expectedResponse = testWorkouts.filter(workout => workout.workoutid !== idToRemove)
            return supertest(app)
                .delete(`/api/workouts/${idToRemove}`)
                .expect(204)
                .then(() => {
                    return supertest(app)
                        .get(`/api/workouts/${idToRemove}`)
                        .expect([])
                })
        });
    });
});

describe(`POST /api/workouts`, () => {

    beforeEach(`insert users into users table`, () => {
        return db
        .insert(testUsers)
        .into('users')
    });

    it(`creates a new workout responds with 201 and the new workout`, () => {
        const newWorkout = {
            workoutname: "2-3-20",
            userid: 1
        }

        return supertest(app)
            .post(`/api/workouts`)
            .send(newWorkout)
            .expect(201)
            .expect(res => {
                expect(res.body[0].workoutname).to.eql(newWorkout.workoutname)
                expect(res.body[0]).to.have.property('workoutid')
                expect(res.headers.location).to.eql(`/api/workouts/${res.body[0].workoutid}`)
            })
            .then(postRes => {
                supertest(app)
                .get(`/api/workouts/${postRes.workoutid}`)
                .expect(postRes.body[0])
            })
    });
});