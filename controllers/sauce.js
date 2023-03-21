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
    Sauce.findOne({ _id: req.params.id }) // Identification de la sauce //
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // Récupération de l'adresse de l'image //
            fs.unlink(`images/${filename}`, () => { // Avec ce nom de fichier, on appelle unlink pour suppr le fichier //
                Sauce.deleteOne({ _id: req.params.id }) // On supprime la sauce de la base de donnée //
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
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLiked.includes(req.body.userId)) 
                {
                    res.status(401).json({error: 'Sauce déja liké'});
                }
                else
                {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }))
                }

            } 
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(401).json({error: 'Sauce déja disliké'});
                }
                else
                {   
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            } 
            else 
            {
                if (sauce.usersLiked.includes(req.body.userId)) 
                {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                } 
                else if (sauce.usersDisliked.includes(req.body.userId)) 
                {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));   
}