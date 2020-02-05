const WorkoutsService = {
    
    getWorkoutByUserId(knex, userId) {
    return (knex)
        .from('workouts')
        .select('*')
        .where('userid', userId)
    },

    getWorkoutById (knex, workoutId) {
        return knex
        .from('workouts')
        .select()
        .where('workoutid', workoutId)
    },

    deleteWorkoutById(knex, workoutId) {
        return knex('exercises')
            .where('exercises.workoutid', workoutId)
            .delete()
            .then(() => {
                return knex('workouts')
                .where('workoutid', workoutId)
                .delete()
            })
    },

    createWorkout(knex, newWorkout) {
        return knex
        .insert(newWorkout)
        .into('workouts')
        .returning(['workoutid', 'workoutname'])
    }

}

module.exports = WorkoutsService