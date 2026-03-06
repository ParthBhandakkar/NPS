import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, requireRole } from '../middleware/auth.js';
import { reports, auditLogs } from '../data/demoData.js';
import { runPipeline } from '../services/mockAws.js';
import users from '../data/users.js';

const router = Router();

// POST /api/reports/upload — Doctor uploads medical report
router.post('/upload', authenticate, requireRole('admin'), (req, res) => {
    try {
        const { patientId, language, literacyLevel, fileName } = req.body;
        const patient = users.find(u => u.id === patientId && u.role === 'patient');

        const newReport = {
            id: uuidv4(),
            patientId: patientId || users.find(u => u.role === 'patient')?.id,
            patientName: patient?.name || 'Unknown Patient',
            doctorId: req.user.id,
            fileName: fileName || 'uploaded_report.pdf',
            fileSize: Math.floor(100000 + Math.random() * 300000),
            uploadedAt: new Date().toISOString(),
            status: 'QUEUED',
            language: language || 'English',
            literacyLevel: literacyLevel || 'Basic',
            extractedData: null,
            explanation: null,
            videoId: null,
            videoUrl: null,
            processingTime: null
        };

        reports.push(newReport);

        // Add audit log
        auditLogs.push({
            id: uuidv4(),
            action: 'REPORT_UPLOADED',
            userId: req.user.id,
            userName: req.user.name,
            target: newReport.fileName,
            timestamp: new Date().toISOString(),
            ip: req.ip
        });

        // Start async pipeline (non-blocking)
        runPipeline(newReport, (status) => {
            newReport.status = status;
        });

        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

// GET /api/reports — List all reports (filtered by role)
router.get('/', authenticate, (req, res) => {
    let filtered;
    if (req.user.role === 'admin') {
        filtered = reports;
    } else {
        filtered = reports.filter(r => r.patientId === req.user.id);
    }

    const safe = filtered.map(({ extractedData, explanation, ...rest }) => rest);
    res.json(safe);
});

// GET /api/reports/:id — Get report details
router.get('/:id', authenticate, (req, res) => {
    const report = reports.find(r => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (req.user.role === 'patient' && report.patientId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    res.json(report);
});

// DELETE /api/reports/:id — Delete report (compliance right-to-erasure)
router.delete('/:id', authenticate, requireRole('admin'), (req, res) => {
    const index = reports.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Report not found' });

    const removed = reports.splice(index, 1)[0];
    auditLogs.push({
        id: uuidv4(),
        action: 'REPORT_DELETED',
        userId: req.user.id,
        userName: req.user.name,
        target: removed.fileName,
        timestamp: new Date().toISOString(),
        ip: req.ip
    });

    res.json({ message: 'Report deleted successfully' });
});

export default router;
