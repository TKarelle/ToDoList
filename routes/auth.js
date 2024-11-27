const express = require('express');
const { User, generateAuthToken } = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('Utilisateur créé');
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Utilisateur non trouvé');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send('Mot de passe incorrect');

    const token = generateAuthToken(user);
    res.json({ token });
});

module.exports = router;
