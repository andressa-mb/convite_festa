const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectionToMongo = require("./connectionToMongo");
const router = require("./src/router");

connectionToMongo();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
