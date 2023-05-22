const controller = require('../controllers/ideaWall');
const router = require('express').Router();

router.get('/:projectId/:ideaWallname', controller.getIdeaWall); //
router.get('/', controller.getAllIdeaWall); //query
router.post('/', controller.createIdeaWall);

module.exports = router;