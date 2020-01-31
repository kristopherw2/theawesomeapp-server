const usersService = {

    getAllUsers(knex) {
        return knex
        .select('*')
        .from('users')
    },

    getUserById(knex, id){
        return knex
        .from('users')
        .select('*')
        .where('id', id)
        .first()
    },

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
        console.log(newUser)
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

    hasUserWithUsername(knex, username){
        return knex
            .from('users')
            .where({username})
            .select('username')
            .then(user => !!user)
    },

    updateUserStats(knex, id, updatedStats) {
        return knex ('users')
        .where({id})
        .update(updatedStats)
    }
};

module.exports = usersService