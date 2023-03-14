const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

// Import du middleware auth pour sécuriser les routes //
const auth = require('../middleware/auth');
// Import du middleware multer pour la gestion des images //
const multer = require('../middleware/multer-config');

// Création des différentes ROUTES de l'API //
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

module.exports = router;