const express = require('express');
const router = express.Router();
const Task = require('../models/task'); // Importer le modèle

// Créer une tâche
router.post('/', async (req, res) => {
  const { text, userId, date } = req.body;
  const task = new Task({ text, userId, date });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer toutes les tâches pour un utilisateur
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    const tasks = await Task.find({ userId }).sort({ date: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une tâche
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { isDone, isInProgress } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (isDone !== undefined) task.isDone = isDone;
    if (isInProgress !== undefined) task.isInProgress = isInProgress;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer une tâche
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
