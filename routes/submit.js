const controller = require('../controllers/submit');
const router = require('express').Router();
const {upload} = require('../middlewares/uploadMiddleware')

router.post('/', upload.array("attachFile"), controller.createSubmit);

module.exports = router;