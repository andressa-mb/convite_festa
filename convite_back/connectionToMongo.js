const mongoose = require("mongoose");
require("dotenv/config");

// Conectar ao MongoDB
const mongoConnect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB conectado"))
        .catch(err => console.log(err));

}

module.exports = mongoConnect;
  