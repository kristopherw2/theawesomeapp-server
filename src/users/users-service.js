const usersService = {
    getUserByUsernamePassword(knex, username, password) {
        return knex
        .from('users')
        .column('username', 'age', 'height')
        .select()
        .where({
            username: username,
            password: password
        })
    }
};

module.exports = usersService