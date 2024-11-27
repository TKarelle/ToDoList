const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.log('Erreur de connexion à MongoDB', err));

// Définir le schéma pour la tâche
const taskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    userId: { type: String, required: true }, // Lié à un utilisateur
    date: { type: Date, default: Date.now },
    isDone: { type: Boolean, default: false },
    isInProgress: { type: Boolean, default: false }
  });
  

// Créer le modèle pour la tâche
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;  // Exporter le modèle pour pouvoir l'utiliser dans d'autres fichiers
