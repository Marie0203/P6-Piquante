const Sauce = require("../models/Sauce");
// File system, package qui permet de modifier et/ou supprimer des fichiers //
const fs = require("fs");

// Création d'une sauce //
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // l'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd //
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
        .catch(error => res.status(400).json({ error }))
};

// Modification d'une sauce //
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(() => res.status(400).json({ error }))
};

// Suppression d'une sauce //
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // on identifie la sauce //
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // on récupère l'adresse de l'image //
            fs.unlink(`images/${filename}`, () => { /// on la supprime du serveur //
                Sauce.deleteOne({ _id: req.params.id }) // on supprime la sauce de la bdd //
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }))
            });
        })
};

// Récupération de toute les sauces //
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};

// Récupération d'une sauce //
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

// Permet de "liker"ou "dislaker" une sauce //
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    if (like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce appréciée' }))
            .catch(error => res.status(400).json({ error }))

    } else if (like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce dépréciée' }))
            .catch(error => res.status(400).json({ error }))

    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce dépréciée' }))
                        .catch(error => res.status(400).json({ error }))
                }

                else if (sauce.userDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce appréciée' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};