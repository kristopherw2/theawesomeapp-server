const usersService = {
    getUserWithUserName(knex, username){
        return knex
        .from('users')
        .where({username})
        .first()
    },

    getUserByUsernameAgeHeightById(knex, id) {
        return knex
        .from('users')
        .column('username', 'age', 'height')
        .select('*')
        .where({ id })
    },

    insertUser(knex, newUser) {
        return knex
        .insert(newUser)
        .into("users")
        .returning("*")
        .then(rows => {
            return rows[0];
        });
    },

    comparePasswords(knex, password) {
        return knex
        .from('users')
        .where({password})
        .first()
    },

};

module.exports = usersService