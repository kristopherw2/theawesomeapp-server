const knex = require('knex');

const ExercisesService = {
    addNewExercise(knex, newExercise) {
        return knex
        .insert(newExercise)
        .into('exercises')
        .returning('*')
    },
    getExercisesByWorkoutId(knex,workoutid) {
      return knex
      .from('exercises')
      .select()
      .where('workoutid',workoutid)
    },
    deleteExercise(knex,exerciseid){
      return knex
      .from('exercises')
      .where('exerciseid',exerciseid)
      .del()
    },
    getExercisesByUserId(knex,userid) {
      return knex
      .from('exercises')
      .select()
      .where('userid',userid)
    }
};

module.exports = ExercisesService;
