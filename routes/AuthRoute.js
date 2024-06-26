const express = require('express');
const {
    login,
    logout,
    getMe,
    refreshToken,
} = require('../controllers/AuthController.js');
// const { refreshToken } = require('../controllers/RefreshToken.js');
const { verifyUser } = require('../middleware/VerifyUser.js');

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyUser, getMe);
router.get('/token', refreshToken);
router.delete('/logout', logout);

module.exports = router;
