function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'firstuser',
            password: 'password1',
            age: 35,
            height: 70,
            weight: 120,
        },
        {
            id: 2,
            username: 'seconduser',
            password: 'password2',
            age: 34,
            height: 69,
            weight: 140
        },
        {
            id: 3,
            username: 'thirduser',
            password: 'password3',
            age: 33,
            height: 68,
            weight: 200
        },
        {
            id: 4,
            username: 'fourthuser',
            password: 'password4',
            age: 32,
            height: 67,
            weight: 245
        }
    ]
};

module.exports = {
    makeUsersArray,
}