const express = require('express');
const skills = require('../controllers/skillController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Public 
router.get('/', skills.getSkills);

// Private 
router.post('/add', auth, skills.createSkill);
router.put('/:id', auth, skills.updateSkill);
router.delete('/delete/:id', auth, skills.deleteSkill);

module.exports = router;