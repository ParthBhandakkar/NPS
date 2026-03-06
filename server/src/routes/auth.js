import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import users from '../data/users.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, language, literacyLevel } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role: 'patient',
            age: age || null,
            language: language || 'English',
            literacyLevel: literacyLevel || 'Basic',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

export default router;
