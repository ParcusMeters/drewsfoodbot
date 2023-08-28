const mysql = require('mysql');
const config = require('./config');



module.exports = class Database {
  static connection = mysql.createConnection({
    host: config.awsHost,
    user: "admin",
    password: config.awsPassword,
    database: ""
    });
  

  static initialise(){
    this.connect();
    this.connection.query('USE "";', (err, result) => {
      if (err) throw err;
      // Now you can perform other database operations like creating tables
      this.createTable();
    });
    //this.createTable();
    //this.createUserTable();
    //this.createLunchTable();
  }
  
  static clearTable(){
    this.connection.query("DROP TABLE IF EXISTS menu_ratings");
    this.connection.query("DROP TABLE IF EXISTS user_review");
    this.connection.query("DROP TABLE IF EXISTS lunch_review");
    

  }


  static connect() {
    this.connection.connect((err) => {
      console.log('Connected to database!');
    });
  }
  //adding comment

  static createTable() {
    this.connection.query('CREATE TABLE IF NOT EXISTS menu_ratings (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      dinner_likes INT,\
      dinner_dislikes INT,\
      lunch_likes INT,\
      lunch_dislikes INT,\
      url TEXT,\
      UNIQUE KEY url_idx (url(255))\
    );', (err, rows) => {
      if (err) throw err;
      console.log('Ratings table created or already exists!');
    });
  }

  static executeQuery(query, callback) {
    try{
      this.connect();
    }
    catch (error){
      console.log(error.name)
      console.log("Already connected!")
    }
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
      query = `INSERT INTO menu_ratings (dinner_likes, dinner_dislikes, lunch_likes, lunch_dislikes, url) VALUES (1, 0, 0, 0, '${url}')ON DUPLICATE KEY UPDATE dinner_likes = dinner_likes + 1;`;
    } else {
      query = `INSERT INTO menu_ratings (dinner_likes, dinner_dislikes, lunch_likes, lunch_dislikes, url) VALUES (0, 1, 0, 0, '${url}')ON DUPLICATE KEY UPDATE dinner_dislikes = dinner_dislikes + 1;`;
    }
    
    Database.executeQuery(query, null);

    console.log("User rated dinner.");
  }

  static newLunchRating(like, url){
    let query;
    if (like === true){
      query = `INSERT INTO menu_ratings (dinner_likes, dinner_dislikes, lunch_likes, lunch_dislikes, url) VALUES (0, 0, 1, 0, '${url}')ON DUPLICATE KEY UPDATE lunch_likes = lunch_likes + 1;`;
    } else {
      query = `INSERT INTO menu_ratings (dinner_likes, dinner_dislikes, lunch_likes, lunch_dislikes, url) VALUES (0, 0, 0, 1, '${url}')ON DUPLICATE KEY UPDATE lunch_dislikes = lunch_dislikes + 1;`;
    }
    
    Database.executeQuery(query, null);

    console.log("User rated lunch.");
  }


  static retrieveData(){
    let query;

    query = 'SELECT * FROM menu_ratings';
    Database.executeQuery(query, null);
  }

  static createUserTable(){
    this.connection.query('CREATE TABLE IF NOT EXISTS user_review (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      has_review_been_made INT,\
      user_PSID TEXT,\
      UNIQUE KEY user_PSIDx (user_PSID(255))\
    );', (err, rows) => {
      if (err) throw err;
      console.log('user_reviews table created or already exists!');
    });
  }

  //table that checks if user has reviewed lunch.
  static createLunchTable(){
    this.connection.query('CREATE TABLE IF NOT EXISTS lunch_review (\
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,\
      has_review_been_made INT,\
      user_PSID TEXT,\
      UNIQUE KEY user_PSIDx (user_PSID(255))\
    );', (err, rows) => {
      if (err) throw err;
      console.log('lunch_review table created or already exists!');
    });
  }


  static hasUserReviewedToday(userPSID) {

    let query;
    
    query = `INSERT INTO user_review (has_review_been_made, user_PSID) VALUES (1, ${userPSID}) ON DUPLICATE KEY UPDATE has_review_been_made = has_review_been_made + 1;`;
    Database.executeQuery(query, null);
  
    query = `SELECT has_review_been_made FROM user_review WHERE user_PSID = ${userPSID};`;
    return new Promise((resolve, reject) => {
      Database.executeQuery(query, (rows) => {
        const hasReviewed = rows[0].has_review_been_made > 1;
        console.log(`User has reviewed today: ${hasReviewed}`);
        resolve(hasReviewed);
      }, (error) => {
        reject(error);
      });
    });
  }

  static hasUserReviewedLunch(userPSID) {

    let query;
    
    query = `INSERT INTO lunch_review (has_review_been_made, user_PSID) VALUES (1, ${userPSID}) ON DUPLICATE KEY UPDATE has_review_been_made = has_review_been_made + 1;`;
    Database.executeQuery(query, null);
  
    query = `SELECT has_review_been_made FROM lunch_review WHERE user_PSID = ${userPSID};`;
    return new Promise((resolve, reject) => {
      Database.executeQuery(query, (rows) => {
        const hasReviewed = rows[0].has_review_been_made > 1;
        console.log(`User has reviewed today: ${hasReviewed}`);
        resolve(hasReviewed);
      }, (error) => {
        reject(error);
      });
    });
  }  
}



