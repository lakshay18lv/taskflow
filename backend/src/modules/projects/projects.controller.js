const asyncHandler = require('../../utils/asyncHandler');
const Task = require('../tasks/task.model');
const Project = require('./project.model');

const serializeProject = (project, stats = {}) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  created_at: project.createdAt,
  task_count: stats.task_count || 0,
  completed_count: stats.completed_count || 0,
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
  const stats = await Task.aggregate([
    { $match: { project: { $in: projects.map((project) => project._id) } } },
    {
      $group: {
        _id: '$project',
        task_count: { $sum: 1 },
        completed_count: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
  ]);
  const statsByProject = new Map(stats.map((item) => [String(item._id), item]));

  res.json({
    projects: projects.map((project) => serializeProject(project, statsByProject.get(project.id))),
  });
});

const createProject = asyncHandler(async (req, res) => {
  const { title, description = '' } = req.body;

  const project = await Project.create({
    user: req.user.id,
    title,
    description,
  });

  res.status(201).json({ project: serializeProject(project) });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.projectId, user: req.user.id });

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  await Task.deleteMany({ project: project._id });

  res.json({ message: 'Project deleted.' });
});

module.exports = { createProject, deleteProject, getProjects };
