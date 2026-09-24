const express = require('express');
const project = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const router = express.Router();
router.get('/', project.getAllProject);
router.get('/:id', project.getProjectById);

router.post('/create', auth, upload.single('image'), project.createProject);
router.put('/:id', auth, upload.single('image'), project.updateProject); 
router.delete('/:id', auth, project.deleteProject); 

module.exports = router;