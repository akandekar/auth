const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'auth-test',
  password: '1234',
  port: 5432,
});

const userSchema = `
  CREATE TABLE IF NOT EXISTS user_details (
    id SERIAL PRIMARY KEY,
    email VARCHAR(500),
    username VARCHAR(500),
    password VARCHAR(255),
    user_type INT
  );
`;

// Create the users table
pool.query(userSchema, (err, result) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('User table created successfully');
  }
});

const User = {
  create: (user, callback) => {
    const insertUserQuery = `
      INSERT INTO user_details (email, username, password, user_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    pool.query(insertUserQuery, [user.email, user.username, user.password, user.user_type], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        callback(err, null);
      } else {
        const insertedUser = result.rows[0];
        console.log('User inserted successfully:', insertedUser);
        callback(null, insertedUser);
      }
    });
  },
  login: (user, callback) => {
    const getUserQuery = `SELECT *
            FROM
                user_details
            WHERE
                email = $1;`;
    pool.query(getUserQuery, [user.email], (err, result) => {
      if (err) {
        console.error('Error while selecting user:', err);
        callback(err, null);
      } else {
        const selectedUser = result.rows[0];
        console.log('Select query successfully:', selectedUser);
        callback(null, selectedUser);
      }
    });
  },
};

module.exports = User;
