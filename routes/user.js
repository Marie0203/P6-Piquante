const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// Création des routes Inscription et Connexion de l'API //
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;