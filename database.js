const mongoose = require("mongoose");
const uri = "mongodb+srv://admin:admin@cluster0.q1dvrdi.mongodb.net/SpiralAbyss?retryWrites=true&w=majority";
mongoose.connect(uri, function(error, client) {
    if (error) {
      return console.log(error);
    }
    console.log("Connected to database.");
  }
);