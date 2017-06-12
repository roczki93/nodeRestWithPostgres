const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://myuser:mypass@192.168.177.183:5432/rest';

//get user info
router.get('/api/v1/userinfo', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data 
	//select * from user_information limit 10;
    const query = client.query('SELECT * FROM user_information ORDER BY id DESC limit 10;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
//by id
router.get('/api/v1/userinfo/:findParam', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data 
	//select * from user_information limit 10;
    const query = client.query('SELECT * FROM user_information WHERE first_name = $1 OR last_name = $2 OR email = $3 OR city = $4 OR street = $5;',
	[req.params.findParam, req.params.findParam, req.params.findParam, req.params.findParam, req.params.findParam]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
//end!
//add user info
router.post('/api/v1/userinfo', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, gender: req.body.gender, city: req.body.city, street: req.body.street, latitude: req.body.latitude, longitude: req.body.longitude};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    
    client.query('INSERT INTO user_information(first_name, last_name, email, gender, city, street, latitude, longitude) values($1, $2, $3, $4, $5, $6, $7,$8)',
	[data.first_name, data.last_name, data.email, data.gender, data.city, data.street, data.latitude, data.longitude]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM user_information ORDER BY id DESC limit 1');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.send("OK");
	  //return res.json(results);
    });
  });
});
//end!
//update user info
router.put('/api/v1/userinfo/:user_info_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.user_info_id;
  // Grab data from http request
  const data = {first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, gender: req.body.gender, city: req.body.city, street: req.body.street, latitude: req.body.latitude, longitude: req.body.longitude};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
	
    client.query('UPDATE user_information SET first_name=($1), last_name=($2), email=($3), gender=($4), city=($5), street=($6), latitude=($7), longitude=($8) WHERE id=($9)',
    [data.first_name, data.last_name, data.email, data.gender, data.city, data.street, data.latitude, data.longitude,id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM user_information ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
//end!
router.delete('/api/v1/userinfo/:user_info_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.user_info_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM user_information WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM user_information ORDER BY id ASC limit 1');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
//delete user info

//end!

//add user
router.post('/api/v1/auth/add', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {username: req.body.username, pass: req.body.pass};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    
    client.query('INSERT INTO users(username, pass) values($1, $2)',
	[data.username, data.pass]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM users ORDER BY id DESC limit 1');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
//end-add user

//auth user
router.post('/api/v1/auth', (req, res, next) => {
  const results = [];
  const data = {username: req.body.username, pass: req.body.pass};
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT id FROM users where username = $1 and pass = $2 order by id desc limit 1',
    [data.username, data.pass]);
 //   var tmp=false;
//	var token=null;
	query.on('row', (row) => {
      console.log(row);
	  if(''!=row.id){
		//create new token in tokens table
		console.log("Create new token");
//		query_add_token=client.query('INSERT INTO tokens (userid) values ($1)', [row.id]);
	  }
	});
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
//	query_add_token.on('row', (row) => {
//		results.push(row);			
//	});
    // After all data is returned, close connection and return results
    query.on('end', () => {
	  query_add_token=client.query('INSERT INTO tokens (userid) values ($1)', [row.id]);
      query_add_token.on('row', (row) => {
		results.push(row);			
	  });
      done();	  
      return res.json(results[0]['id']);
	});
//	query_add_token.on('end', () => {
//      done();
//      return res.json(results);
//	});
  });
});
//end auth user

//show users
router.get('/api/v1/auth', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM users ORDER BY id DESC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
//end show users


router.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.put('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.delete('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
