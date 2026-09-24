const express = require('express');
const experience = require('../controllers/experienceController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Public 
router.get('/', experience.getExperience);

// Private 
router.post('/add', auth, experience.createExperience);
router.put('/:id', auth, experience.updateExperience); // تم تعديلها لتتقبل الـ ID
router.delete('/delete/:id', auth, experience.deleteExperience);

module.exports = router;