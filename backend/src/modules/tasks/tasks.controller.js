const asyncHandler = require('../../utils/asyncHandler');
const Project = require('../projects/project.model');
const Task = require('./task.model');

const serializeTask = (task) => ({
  id: task.id,
  project_id: String(task.project),
  title: task.title,
  status: task.status,
  due_date: task.dueDate,
  created_at: task.createdAt,
});

const ensureProjectOwner = async (projectId, userId) => {
  return Project.exists({ _id: projectId, user: userId });
};

const getTasks = asyncHandler(async (req, res) => {
  const ownsProject = await ensureProjectOwner(req.params.projectId, req.user.id);

  if (!ownsProject) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });

  res.json({ tasks: tasks.map(serializeTask) });
});

const createTask = asyncHandler(async (req, res) => {
  const ownsProject = await ensureProjectOwner(req.params.projectId, req.user.id);

  if (!ownsProject) {
    return res.status(404).json({ message: 'Project not found.' });
  }

  const { title, dueDate = null } = req.body;
  const task = await Task.create({
    project: req.params.projectId,
    title,
    dueDate: dueDate ? new Date(dueDate) : null,
  });

  res.status(201).json({ task: serializeTask(task) });
});

const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const ownsProject = await ensureProjectOwner(task.project, req.user.id);

  if (!ownsProject) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();

  res.json({ task: serializeTask(task) });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const ownsProject = await ensureProjectOwner(task.project, req.user.id);

  if (!ownsProject) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  await task.deleteOne();

  res.json({ message: 'Task deleted.' });
});

module.exports = { createTask, deleteTask, getTasks, toggleTask };
