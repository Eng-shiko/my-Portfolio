const express = require('express');
const message = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Public 
router.post('/message', message.createMessage);

// Private 
router.get('/', auth, message.getMessage);
router.put('/:id', auth, message.updateStatus); // تم تعديلها لتتقبل الـ ID
router.delete('/delete/:id', auth, message.deleteMessage);

module.exports = router;