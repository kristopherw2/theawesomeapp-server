const knex = require('knex');

const ExercisesService = {
    addNewExercise(knex,newExercise) {
        return knex
        .insert(newExercise)
        .into('exercises')
        .returning('*')
    },
    pullExercises(knex,workoutid) {
      return knex
      .from('exercises')
      .select('*')
      .where('workoutid',workoutid)
    },
    deleteExercise(knex,exerciseid){
      return knex
      .from('exercises')
      .where('exerciseid',exerciseid)
      .del()
    }
};

module.exports = ExercisesService;
