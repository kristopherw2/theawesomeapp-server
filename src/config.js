/* const app = require('./app')
const { PORT } = require('./config') */

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://ort_cloud:order66@localhost//fitness-pizza',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
/*     TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://kristopherwilliams@localhost/fitness-pizza-test' */
}
/* {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/fitness-pizza',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/fitness-pizza-test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
} */
