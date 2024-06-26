const argon2 = require('argon2');
const { User } = require('../models/index.js');
const jwt = require('jsonwebtoken');

exports.getMe = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith('Bearer ')
        ) {
            console.log(
                'No authorization header or token does not start with Bearer'
            );
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authorizationHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            console.log('Invalid token:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = decoded.id;
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ msg: 'User not found' });
        }

        const { id, fullname, username, email } = user;
        res.status(200).json({ id, fullname, username, email });
    } catch (error) {
        console.log('Error in getMe handler:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || (username && email)) {
        return res
            .status(400)
            .json({ msg: 'Either username or email is required, not both' });
    }

    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    try {
        let user;

        if (email) {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (isEmail) {
                user = await User.findOne({ where: { email } });
            } else {
                return res.status(400).json({ msg: 'Invalid email format' });
            }
        } else {
            user = await User.findOne({ where: { username } });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '15m', // Changed from '15s' to '15m' for more practical expiration time
            }
        );
        const refreshToken = jwt.sign(
            {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '3d',
            }
        );
        await user.update({ refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure cookie is secure in production
            sameSite: 'Strict',
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        });

        const { id, fullname, username: userUsername, email: userEmail } = user;
        res.status(200).json({
            id,
            fullname,
            username: userUsername,
            email: userEmail,
            token: accessToken,
        });
    } catch (error) {
        console.log('Error in login handler:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie('refreshToken', '', { maxAge: 0 });
        return res.sendStatus(200);
    } catch (error) {
        console.error('Logout error: ', error);
        return res.sendStatus(500);
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const user = await jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const accessToken = jwt.sign(
            {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' } // Changed from '15s' to '15m' for more practical expiration time
        );
        res.json({ accessToken });
    } catch (err) {
        console.log('Invalid refresh token:', err);
        return res.sendStatus(403);
    }
};
