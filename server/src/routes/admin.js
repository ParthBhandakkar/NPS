import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { reports, auditLogs } from '../data/demoData.js';
import users from '../data/users.js';

const router = Router();

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', authenticate, requireRole('admin'), (req, res) => {
    const totalPatients = users.filter(u => u.role === 'patient').length;
    const totalReports = reports.length;
    const readyVideos = reports.filter(r => r.status === 'READY').length;
    const processing = reports.filter(r => !['READY', 'FAILED', 'QUEUED'].includes(r.status)).length;
    const avgProcessingTime = reports
        .filter(r => r.processingTime)
        .reduce((sum, r) => sum + r.processingTime, 0) / (readyVideos || 1);

    const languageBreakdown = {};
    reports.forEach(r => {
        languageBreakdown[r.language] = (languageBreakdown[r.language] || 0) + 1;
    });

    const statusBreakdown = {};
    reports.forEach(r => {
        statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
    });

    res.json({
        totalPatients,
        totalReports,
        videosGenerated: readyVideos,
        processingNow: processing,
        avgProcessingTime: Math.round(avgProcessingTime),
        languageBreakdown,
        statusBreakdown,
        recentActivity: auditLogs.slice(-10).reverse()
    });
});

// GET /api/admin/audit-logs — Compliance audit trail
router.get('/audit-logs', authenticate, requireRole('admin'), (req, res) => {
    const { action, limit = 50 } = req.query;
    let filtered = [...auditLogs];
    if (action) {
        filtered = filtered.filter(l => l.action === action);
    }
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(filtered.slice(0, parseInt(limit)));
});

export default router;
