require('dotenv').config();

const sql = require('../src/config/db_config');

afterAll(() => sql.end());