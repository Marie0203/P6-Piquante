const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupération du token de la requête entrante //
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérification du token avec la clé secrète //
        const userId = decodedToken.userId; // Vérification que le userId envoyé avec la requête correspond au userId encodé dans le token //    
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User id non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Requête non authentifiée !') });
    }
};