function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'firstuser',
            password: 'password1',
            age: 35,
            height: 70,
            userweight: 120,
        },
        {
            id: 2,
            username: 'seconduser',
            password: 'password2',
            age: 34,
            height: 69,
            userweight: 140
        },
        {
            id: 3,
            username: 'thirduser',
            password: 'password3',
            age: 33,
            height: 68,
            userweight: 200
        },
        {
            id: 4,
            username: 'fourthuser',
            password: 'password4',
            age: 32,
            height: 67,
            userweight: 245
        }
    ]
};

module.exports = {
    makeUsersArray,
}