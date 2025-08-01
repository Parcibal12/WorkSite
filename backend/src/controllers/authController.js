const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
    register: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        try {
            const existingUserByUsername = await User.findOne({ where: { username } });
            if (existingUserByUsername) {
                return res.status(409).json({ message: 'Username is already registered.' });
            }

            const existingUserByEmail = await User.findOne({ where: { email } });
            if (existingUserByEmail) {
                return res.status(409).json({ message: 'Email is already registered.' });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = await User.create({
                username: username,
                email: email,
                password_hash: passwordHash
            });

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token: token
            });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'User or email already exists.' });
            }
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                return res.status(400).json({ message: 'Validation error: ' + errors.join(', ') });
            }
            res.status(500).json({
                message: 'Internal server error during registration.',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token: token
            });

        } catch (error) {
            res.status(500).json({
                message: 'Internal server error during login.',
                error: error.message
            });
        }
    },

    getMe: async (req, res) => {
        try {
            res.status(200).json({
                message: 'Authenticated user data access successful.',
                user: req.user,
                secretData: 'This is secret information only logged-in users can see'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error while fetching user data.',
                error: error.message
            });
        }
    }
};

module.exports = authController;