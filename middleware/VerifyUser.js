const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');

exports.verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        console.log(`Verifying token: ${token}`);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            console.log('Token verification failed');
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        console.log(`Verified token: ${decoded.id}`);
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'fullname', 'username', 'email'],
        });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: error.message });
    }
};
