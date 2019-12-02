const {
  DB_USER, 
  DB_PASSWORD, 
  DB_URL, 
  DB_NAME, 
  PORT,
}  = process.env

const dbConfig = {
  user:  DB_USER,
  password: DB_PASSWORD,
  server: DB_URL,
  database: DB_NAME,
  options: {
      encrypt: false,

  }
};

module.exports = dbConfig;