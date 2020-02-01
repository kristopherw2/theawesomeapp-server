const WorkoutsService = {
    getWorkoutByUserId(knex, userId) {
    return (knex)('workouts')
        .select('*')
        .where('id', userId)
    }

}

module.exports = WorkoutsService