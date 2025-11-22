const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Organisation, Log } = require('../models');

exports.register = async (req, res) => {
    try {
        const { orgName, adminName, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create Organisation
        const organisation = await Organisation.create({ name: orgName });

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            organisation_id: organisation.id,
            email,
            password_hash,
            name: adminName
        });

        // Log action
        await Log.create({
            organisation_id: organisation.id,
            user_id: user.id,
            action: 'organisation_created',
            meta: { orgId: organisation.id }
        });

        // Generate Token
        const token = jwt.sign(
            { userId: user.id, orgId: organisation.id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, orgId: organisation.id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Log login
        await Log.create({
            organisation_id: user.organisation_id,
            user_id: user.id,
            action: 'user_logged_in',
            meta: {}
        });

        const token = jwt.sign(
            { userId: user.id, orgId: user.organisation_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, orgId: user.organisation_id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
