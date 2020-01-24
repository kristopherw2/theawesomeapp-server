const app = require('./app')
const { PORT } = require('./config')

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://kristopherwilliams@localhost/fitness-pizza'
}