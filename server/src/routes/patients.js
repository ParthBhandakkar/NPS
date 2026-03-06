import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import users from '../data/users.js';

const router = Router();

// GET /api/patients — List all patients (admin only)
router.get('/', authenticate, requireRole('admin'), (req, res) => {
    const patients = users
        .filter(u => u.role === 'patient')
        .map(({ password, ...p }) => p);
    res.json(patients);
});

// GET /api/patients/:id — Get patient profile
router.get('/:id', authenticate, (req, res) => {
    const patient = users.find(u => u.id === req.params.id && u.role === 'patient');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    if (req.user.role === 'patient' && req.user.id !== patient.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const { password, ...safe } = patient;
    res.json(safe);
});

// POST /api/patients/:id/profile — Update patient profile
router.post('/:id/profile', authenticate, (req, res) => {
    const patient = users.find(u => u.id === req.params.id && u.role === 'patient');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    if (req.user.role === 'patient' && req.user.id !== patient.id) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const { language, literacyLevel, age, name } = req.body;
    if (language) patient.language = language;
    if (literacyLevel) patient.literacyLevel = literacyLevel;
    if (age) patient.age = age;
    if (name) patient.name = name;

    const { password, ...safe } = patient;
    res.json(safe);
});

export default router;
