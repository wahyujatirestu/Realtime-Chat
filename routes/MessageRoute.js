const express = require('express');
const { sendMessage } = require('../controllers/MessageController.js');
const { verifyUser } = require('../middleware/VerifyUser.js');

const router = express.Router();

router.post('/messages/:id', verifyUser, sendMessage);

module.exports = router;
