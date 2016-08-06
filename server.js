// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Animal = require('./models/animal');

// Connect to the animals MongoDB
mongoose.connect('mongodb://testuser:123qweasd@ds139985.mlab.com:39985/animals1');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low on animal!' }); 
});

// Create a new route with the prefix /animals
var animalsRoute = router.route('/animals');

// Create endpoint /api/animals for POSTS
animalsRoute.post(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Animal model
  var animal = new Animal();

  // Set the animal properties that came from the POST data
  animal.name = req.body.name;
  animal.species = req.body.species;
  animal.age = req.body.age;
  animal.owner = req.body.owner;

  // Save the animal and check for errors
  animal.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Animal added to the database!', data: animal });
  });
});

// Create endpoint /api/animals for GET
animalsRoute.get(function(req, res) {
  // Use the Animal model to find all animal
  Animal.find(function(err, animals) {
    if (err)
      res.send(err);

    res.json(animals);
  });
});

// Create a new route with the /animals/:animal_id prefix
var animalRoute = router.route('/animals/:animal_id');

// Create endpoint /api/animals/:animal_id for GET
animalRoute.get(function(req, res) {
  // Use the Animal model to find a specific animal
  Animal.findById(req.params.animal_id, function(err, animal) {
    if (err)
      res.send(err);

    res.json(animal);
  });
});

// Create endpoint /api/animals/:animal_id for PUT
animalRoute.put(function(req, res) {
  // Use the Animal model to find a specific animal
  Animal.findById(req.params.animal_id, function(err, animal) {
    if (err)
      res.send(err);

    console.log(req.params.animal_id);
    // Update the existing animal quantity
    if(req.body.name){
      animal.name = req.body.name;
    }
    if(req.body.species){
    animal.species = req.body.species;
    }
    if(req.body.age){
    animal.age = req.body.age;
    }
    if(req.body.owner){
    animal.owner = req.body.owner;
    }


    // Save the animal and check for errors
    animal.save(function(err) {
      if (err)
        res.send(err);

      console.log(animal);

      res.json(animal);
    });
  });
});

// Create endpoint /api/animals/:animal_id for DELETE
animalRoute.delete(function(req, res) {
  // Use the Animal model to find a specific animal and remove it
  Animal.findByIdAndRemove(req.params.animal_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Animal removed from the database!' });
  });
});

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert animal on port ' + port);