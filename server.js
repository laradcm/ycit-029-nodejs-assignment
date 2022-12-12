
//-----------imports & setup--------
const express = require("express");
const userRouter = express.Router();
const PORT = 3000;

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
  new user("1","john Doe", 32),
  new user("2","Jane Doe", 30),
  new user("3","John Smith", 25)
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
  res.json(data);
}


function createUser(req, res){

  // const newUser = new user( generateId() , "username" , getRandomNum(100,1));// generates new user without body for testing

  const newUser = new user( generateId() , req.body.name , req.body.age);
  data.push(newUser);

  res.json(data);
}


function readUniqueUser(req, res){

  const uniqueUser = data.find(user => user.id == req.params.id);
  console.log(uniqueUser);

  res.json(uniqueUser);
}


function updateUniqueUser(req, res){

  const updatedUser = new user(req.params.id , req.body.name , req.body.age);
  const userIndex = data.findIndex(user => user.id == req.params.id);
  data[userIndex] = updatedUser;

  res.json(data);
}


function deleteUniqueUser(req, res){

  const userIndex = data.findIndex(user => user.id == req.params.id);
  data.splice(userIndex, 1);

  res.json(data);
}


function generateId(){
  
  if (data.length < 100 ) {

    let newId = 1;
    while(data.find(user => user.id == newId) != undefined){
      newId = getRandomNum(1, 100);
    }
  
    return String(newId);

  }else{

    throw("Maximum number of users reached");

  }
}


function getRandomNum(min, max){

  return (Math.floor(Math.random()*(max - min))) + min;
}

