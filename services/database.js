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
    this.createTable();
  }
  

  static connect() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log('Connected to database!');
    });
  }
  //adding comment

  static createTable() {
    this.connection.query('CREATE TABLE IF NOT EXISTS menu_ratings (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      likes INT,\
      dislikes INT,\
      url TEXT,\
      UNIQUE KEY url_idx (url(255))\
    );', (err, rows) => {
      if (err) throw err;
      console.log('Ratings table created or already exists!');
      this.close();
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


  static hasReviewBeenMade(url){

  }

  static newRating(like, url){
    let query;
    if (like === true){
      query = `INSERT INTO menu_ratings (likes, dislikes, url) VALUES (1, 0, '${url}')ON DUPLICATE KEY UPDATE likes = likes + 1;`;
    } else {
      query = `INSERT INTO menu_ratings (likes, dislikes, url) VALUES (0, 1, '${url}')ON DUPLICATE KEY UPDATE dislikes = dislikes + 1;`;
    }
    Database.executeQuery(query, null);

    console.log("User rated menu.");
  }


  static retriveData(){
    let query;

    query = 'SELECT * FROM menu_ratings';
    Database.executeQuery(query, null);
  }
}
