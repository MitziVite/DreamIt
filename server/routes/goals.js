const express = require('express');
const router = express.Router();
const Goal = require('../models/goal.model');

// GET all goals
router.get('/', (req, res) => {
  Goal.find()
    .then(goals => {
      res.status(200).json({
        message: 'Goals fetched successfully',
        goals: goals
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// GET single goal
router.get('/:id', (req, res) => {
  Goal.findOne({ "id": req.params.id })
    .then(goal => {
      res.status(200).json(goal);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST new goal
router.post('/', (req, res) => {
  const goal = new Goal({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    completed: req.body.completed
  });

  goal.save()
    .then(createdGoal => {
      res.status(201).json({
        message: 'Goal added successfully',
        goal: createdGoal
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update goal
router.put('/:id', (req, res) => {
  Goal.findOneAndUpdate(
    { id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      completed: req.body.completed
    },
    { new: true }
  )
    .then(updatedGoal => {
      res.status(200).json(updatedGoal);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE goal
router.delete('/:id', (req, res) => {
  Goal.findOneAndDelete({ id: req.params.id })
    .then(() => {
      res.status(200).json({ message: 'Goal deleted successfully' });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;