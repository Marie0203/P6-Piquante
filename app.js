const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const path = require("path");
const app = express();


// Connection à la base de donnée MongoDB //
mongoose.connect('mongodb+srv://marie_29:W3K6DcQuPjD1FUdr@cluster0.y49qg5j.mongodb.net/?retryWrites=true&w=majority',
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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;