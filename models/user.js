const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email //

// Schéma de données dédié à l'utilisateur //
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);