const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Accès refusé');

    try {
        const decoded = jwt.verify(token, 'ton_secret_key');
        req.user = decoded;  // Stocke les informations de l'utilisateur dans la requête
        next();
    } catch (error) {
        res.status(400).send('Token invalide');
    }
}

module.exports = authenticateUser;
