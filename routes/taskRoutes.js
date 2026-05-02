const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllTasks,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

// Note: taskRoutes can be accessed via /api/projects/:projectId/tasks 
// or directly /api/tasks/:id

router.route('/')
  .get(protect, (req, res, next) => {
    // If projectId is in params (from mergeParams), use getTasks
    // Otherwise, it's a global call, restrict to Admin
    if (req.params.projectId) {
      return getTasks(req, res);
    }
    return authorize('admin')(req, res, () => getAllTasks(req, res));
  })
  .post(protect, authorize('admin'), createTask);

router.route('/:id')
  .put(protect, authorize('admin'), updateTask)
  .delete(protect, authorize('admin'), deleteTask);

module.exports = router;
