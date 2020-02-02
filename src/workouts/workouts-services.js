const WorkoutsService = {
    getWorkoutByUserId(knex, userId) {
    return (knex)
        .from('workouts')
        .select('*')
        .where('userid', userId)
    }

}

module.exports = WorkoutsService