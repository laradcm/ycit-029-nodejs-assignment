
//-----------imports & setup--------
const Joi = require("joi"); //for data validation
const express = require("express");
const userRouter = express.Router();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

class user{
  constructor(id, name, age) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}

const data = [
  new user(1,"john Doe", 32),
  new user(2,"Jane Doe", 30),
  new user(3,"John Smith", 25)
];


//route setup
app.use("/api/users", userRouter);

try {

  userRouter.route("/")
    .get(readAllUsers)
    .post(createUser);

  userRouter.route("/:id")
    .get(readUniqueUser)
    .put(updateUniqueUser)
    .delete(deleteUniqueUser);

} catch (error) {

  console.error(error);
}


// Add a new route to get a *SINGLE* user (you can use either path param or query param)
// /api/users/1      <-- path param (req.params.id)
// /api/users?id=1   <-- query param (req.query.id) If you go with query param, just modify the existing endpoint above instead of creating a new endpoint

// BONUS QUESTION - Add routes to implement all the CRUD operations (POST, PUT, DELETE)

app.listen(PORT, () => {
  console.log("Lara's assignment listening on port " + PORT);
});


//------subroutines--------------
function readAllUsers(req, res){
  res.send(data);
}


function createUser(req, res){

  const {error} = validate(req.body);
  if (error) return res.status(400).send("Failed to create user, " + error.details[0].message);
  
  const newUser = new user( generateId() , req.body.name , req.body.age );
  data.push(newUser);

  res.send(data[data.length-1]);
}


function readUniqueUser(req, res){

  const id = parseInt(req.params.id);
  const uniqueUser = data.find( user => user.id === id );

  uniqueUser? res.send(uniqueUser) : res.status(404).send("Failed to read user, user ID not found");
}


function updateUniqueUser(req, res){

  const id = parseInt(req.params.id);
  const userIndex = data.findIndex( user => user.id === id );
  const {error} = validate(req.body);

  if (userIndex < 0) return res.status(404).send("Failed to update user, user ID not found");

  if (error) return res.status(400).send("Failed to update user, " + error.details[0].message);
        
  const updatedUser = new user( id , req.body.name , req.body.age );
  data[userIndex] = updatedUser;

  res.send(data[userIndex]); 
}



function deleteUniqueUser(req, res){

  const id = parseInt(req.params.id);
  const userIndex = data.findIndex( user => user.id === id );

  if (userIndex < 0) return res.status(404).send("Failed to delete user, user ID not found");

  data.splice(userIndex, 1);

  res.send(data);
}


function validate(inputData){

  const schema = Joi.object({ 

    name: Joi.string().required(),
    age: Joi.required()

  });

  return schema.validate(inputData);
}


function generateId(){
//not the best way, but didnt want to create annoying ids for testing
//would've used uuid instead
  
  if (data.length < 15 ) {

    let newId = getRandomNum(1, 1000);

    while(data.find(user => user.id == newId) != undefined){
      newId = getRandomNum(1, 1000);//Big difference from total length (15) or else it'll loop for a long time

    }
  
    return newId;

  }else{

    throw("Maximum number of users reached: " + data.length);

  }
}


function getRandomNum(min, max){

  return (Math.floor(Math.random()*(max - min))) + min;
}

