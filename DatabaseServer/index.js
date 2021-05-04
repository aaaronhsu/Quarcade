const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();

//for connection string
require("dotenv").config();

//converts frontend data to readable json
app.use(bodyParser.json());

//app.use(express.json()); //lets server accept json stuff
app.use(cors()); //some trust able thingy that I don't get

// FOR HEROKU
app.use(express.static('client/build'));

// to look nicer
app.get('/', (req, res) => {res.send('Backend is running')})

//connect to the routes--> if you go to localhost:5000/homeLobby you can get all the data that's been posted
const homeLobbyRouter = require("./routes/homeLobby");
app.use("/homeLobby", homeLobbyRouter);

//connect the routes that are in a room (alphasoup for now)
const alphaSoupRouter = require("./routes/alphaSoup");
app.use("/alphaSoup", alphaSoupRouter);

//connect the user routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

//error handling middleware
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(400).send({ error: err.message });
});


//connect to my database
const PORT = process.env.PORT;
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch(error => console.log(error.message));

mongoose.set("useFindAndModify", false); //avoids some deprecation stuff?
