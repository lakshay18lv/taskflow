const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
} = require('./tasks.controller');

const router = express.Router();

router.use(auth);

router.get(
  '/projects/:projectId/tasks',
  [param('projectId').isMongoId().withMessage('Invalid project id.')],
  validate,
  getTasks
);

router.post(
  '/projects/:projectId/tasks',
  [
    param('projectId').isMongoId().withMessage('Invalid project id.'),
    body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Task title is required.'),
    body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Due date must be valid.'),
  ],
  validate,
  createTask
);

router.patch(
  '/tasks/:taskId/toggle',
  [param('taskId').isMongoId().withMessage('Invalid task id.')],
  validate,
  toggleTask
);

router.delete(
  '/tasks/:taskId',
  [param('taskId').isMongoId().withMessage('Invalid task id.')],
  validate,
  deleteTask
);

module.exports = router;
