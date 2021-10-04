const { appendFile } = require('fs');

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cons = require('consolidate'),
	dust = require('dustjs-helpers'),
	mysql = require('mysql'),
	app = express();

// DB Connect String
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Prakash@2001M',
	database: 'recipebook'
});

connection.connect(function(err) {
	if (err) {
	  console.error('error connecting database');
	}else {
		console.log('Connection Successful');
	}
});

// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res, next) {
    connection.query("SELECT * FROM recipes", function(err, rows, fields){
    	if(err) throw err;
    	res.render('index', {
    		"recipes": rows
    	});
    });
});

app.post('/add', function(req, res, next) {
	// Get Form Values
  var name     = req.body.name;
  var ingredients = req.body.ingredients;
  var directions = req.body.directions;

  var recipe  = {
	name: name,
	ingredients: ingredients,
	directions: directions,
  };

   connection.query('INSERT INTO recipes SET ?',recipe, function(err, result){
   console.log('Error: '+err);
   console.log('Success: '+result);
  });
  res.redirect('/');
});

// Server
app.listen(3000, function(){
	console.log('Server Started On Port 3000');
});