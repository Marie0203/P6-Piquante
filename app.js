const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauce");
const path = require("path");
const app = express();

// Utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement //
require('dotenv').config();


// Connection à la base de donnée MongoDB //
mongoose.connect(process.env.DB_PASSWORD,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));


// Partage de ressources entre serveurs (CORS) //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json());
app.use(bodyParser.json());
// Gestion de la ressource image de façon statique //
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes attendues //
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// Export de l'application //
module.exports = app;