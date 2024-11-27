const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// Créer un modèle utilisateur
const User = mongoose.model('User', userSchema);

// Fonction pour générer un token JWT
function generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id }, 'ton_secret_key', { expiresIn: '1h' });
    return token;
}

module.exports = { User, generateAuthToken };
