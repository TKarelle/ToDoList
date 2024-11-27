const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const app = express();
connectDB(); 

app.use(bodyParser.json());


// Middleware
app.use(express.json());
app.use(cors());

// Utiliser les routes des tâches
app.use('/tasks', tasksRoutes);

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Failed to connect to MongoDB:', err));

// Route d'inscription (création d'un utilisateur)
app.post('/register', async (req, res) => {
  try {
    console.log('Requête reçue', req.body); // Ajoute un log pour voir ce qui est envoyé par Postman
    
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Utilisateur déjà existant');
      return res.status(400).send('Utilisateur déjà existant');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    console.log('Utilisateur créé', user);
    
    res.status(201).send('Utilisateur créé');
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).send('Erreur serveur');
  }
});

// Route de connexion (authentification de l'utilisateur)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Recherche de l'utilisateur
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('Utilisateur non trouvé');

  // Vérification du mot de passe
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).send('Mot de passe incorrect');

  // Génération du token JWT
  const token = jwt.sign({ username: user.username }, 'tonSecretKey', { expiresIn: '1h' });
  
  // Envoi du token au client
  res.json({ token });
});

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Accès non autorisé');
    }

    try {
        const decoded = jwt.verify(token, 'tonSecretKey'); // Remplace par ta clé secrète
        req.user = decoded; // Ajoute les infos de l'utilisateur à la requête
        next();
    } catch (err) {
        return res.status(400).send('Token invalide');
    }
}
// Tâche Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  isInProgress: { type: Boolean, default: false },
  userId: { type: String, required: true },  // Lien avec l'utilisateur
  date: { type: String },
});

const Task = mongoose.model('Task', taskSchema);

// Routes pour les tâches
// Ajouter une tâche
app.post('/tasks', async (req, res) => {
  const { text, userId, date } = req.body;
  const task = new Task({ text, userId, date });
  
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Récupérer les tâches d'un utilisateur
app.get('/tasks/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mettre à jour une tâche
app.put('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Supprimer une tâche
app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.status(200).send({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Exemple d'utilisation dans une route protégée
app.get('/protected-route', verifyToken, (req, res) => {
    res.send('Bienvenue dans la route protégée');
});

// Routes
app.use('/api', authRoutes);  // Routes d'authentification
app.use('/api', taskRoutes);  // Routes des tâches

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
