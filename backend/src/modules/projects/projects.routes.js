const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const {
  createProject,
  deleteProject,
  getProjects,
} = require('./projects.controller');

const router = express.Router();

router.use(auth);

router.get('/', getProjects);

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Project title is required.'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description is too long.'),
  ],
  validate,
  createProject
);

router.delete(
  '/:projectId',
  [param('projectId').isMongoId().withMessage('Invalid project id.')],
  validate,
  deleteProject
);

module.exports = router;
