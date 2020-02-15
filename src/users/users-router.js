const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');

usersRouter
    .route('/registration')
    .post(jsonParser, (req, res, next) => {
        const {username, password, age, height, userweight} = req.body
        const newUser = {height, age, username, password, userweight}
        
        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res.status(400).json({
                error: {message: `Missing '${key}' in request body`},
                });
            }
        }

        newUser.username = username;
        newUser.password = password;

    if (!username) {
        return res
            .status(400)
            .send('Username required');
    }
    if (!password) {
        return res
        .status(400)
        .send('Password required');
    }
    if (username.length < 6 || username.length > 20) {
        return res
        .status(400)
        .send('Username must be between 6 and 20 characters');
    }
      // password length
    if (password.length < 8 || password.length > 36) {
        return res
        .status(400)
        .send({error: {message: "Password must be between 8 and 36 characters" } });
    }

    if(password.startsWith(' ') || password.endsWith(' ')) {
        return res
        .status(400)
        .send({error: {
            message: "Password must not start with spaces"
            }
        })
    }

      // password contains digit, using a regex here
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        return res
        .status(400)
        .send({error: { message: 'Password must be contain at least one digit'} });
    }
    
    UsersService.hasUserWithUsername(
        req.app.get('db'),
        username
    )
        .then(hasUserWithUsername => {
            if(hasUserWithUsername) {
                return res.status(400).json({error: {message: `Username already taken`}})
            }
            return UsersService.insertUser(
                req.app.get('db'),
                newUser
            )
                .then(user => {
                    
                    return res.status(201)
                        .location(`/api/users`)
                        .json({
                            id: user.id,
                            username: user.username,
                            age: user.age,
                            height: user.height,
                            userweight: user.userweight
                        })
                })
        })
        .catch(next)
    })

    usersRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        const {username, password } = req.body
        const loginUser = { username, password}

        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res.status(400).json({
                error: {message: `Missing '${key}' in request body`},
                });
            }
        }
        UsersService.getUserWithUserName(
            req.app.get('db'),
            loginUser.username
        )
        .then(dbUser => {
            if(!dbUser)
            return res.status(400).json({
                error: 'Incorrect username or password'
            })
            return UsersService.comparePasswords(
                req.app.get('db'),
                loginUser.password
            )
            .then(password => {
                if(!password){
                    return res.status(400).json({
                        error: `Incorrect username or password`
                    })
                }
                const sub = dbUser.username
                const payload = dbUser.id
                return res.send({
                    id: payload,
                    username: sub,
                })
            })
        })
        .catch(next)
    });

    usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UsersService.getUserById(
            req.app.get('db'),
            req.params.user_id
            )
            .then(user => {
                if(!user) {
                    return res.status(404).json({error: { message: `User does not exist`} })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        
        UsersService.getUserById(
            req.app.get('db'),
            req.params.user_id
        )
        .then(user => {
            if(!user) {
                return res.status(404).json({error: {message: `User does not exist`}})
            }
            res.json({
                id: user.id,
                username: user.username,
                age: user.age,
                height: user.height,
                userweight: user.userweight
            })
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {id, username, height, userweight, age} = req.body
        const userToUpdate = {id, username, height, userweight, age}
        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request must contain a new weight or age`
                }
            })
        }


        UsersService.updateUserStats(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        }) 
        .catch(next)
    });

module.exports = usersRouter