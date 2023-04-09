const mysql = require('mysql');
const config = require('./config');

module.exports = class Database {
  static connection = mysql.createConnection({
    host: config.awsHost,
    user: config.awsUser,
    password: config.awsPassword,
    database: config.awsDatabase
  });

  static initialise(){
    this.connect();
    this.createTable;
  }

  static connect() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log('Connected to database!');
    });
  }
  //adding comment

  static createTable() {
    this.connection.query('CREATE TABLE IF NOT EXISTS ratings (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      likes INT,\
      dislikes INT,\
      url TEXT\
    );', (err, rows) => {
      if (err) throw err;
      console.log('Ratings table created or already exists!');
    });
  }

  static executeQuery(query, callback) {
    this.connection.query(query, (err, rows) => {
      if (err) throw err;

      console.log('Data received from database:\n');
      console.log(rows);

      if (callback) {
        callback(rows);
      }
    });
  }

  static close() {
    this.connection.end((err) => {
      if (err) throw err;
      console.log('Database connection closed!');
    });
  }

  static newRating(like, url){
    let query;
    if (like === true){
      query = `UPDATE ratings SET likes = likes + 1 WHERE url = '${url}';`;
    } else {
      query = `UPDATE ratings SET dislikes = dislikes + 1 WHERE url = '${url}';`;
    }

    Database.executeQuery(query, null)
  }
}
