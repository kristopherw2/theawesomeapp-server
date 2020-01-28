const usersService = {
    getAllUsers(knex){
        return knex
        .select()
        .from('users')
        
    },
    getUserByUsernameAgeHeightById(knex, id) {
        return knex
        .from('users')
        .column('username', 'age', 'height')
        .select('*')
        .where({ id })
    },

    insertUser(db, newUser) {
        return db
          .insert(newUser)
          .into("users")
          .returning("*")
          .then(rows => {
            return rows[0];
          });
      },
};

module.exports = usersService