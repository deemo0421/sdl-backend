const controller = require('../controllers/project');
const router = require('express').Router();

router.get('/:projectId', controller.getProject);
router.get('/', controller.getAllProject);
router.post('/', controller.createProject);
router.put('/:projectId', controller.updateProject);
router.delete('/:projectId', controller.deleteProject);

module.exports = router;