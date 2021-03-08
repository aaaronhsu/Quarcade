const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
//testing

//for connection string
require("dotenv").config();

app.use(express.json()); //lets server accept json stuff
app.use(cors()); //some trust able thingy that I don't get

//connect to the routes--> if you go to localhost:5000/roomCodes you can get all the data that's been posted
const roomCodesRouter = require("./routes/roomCodes");
app.use("/roomCodes", roomCodesRouter);

//connect to my database
const PORT = process.env.PORT;
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch(error => console.log(error.message));

mongoose.set("useFindAndModify", false); //avoids some deprecation stuff?
