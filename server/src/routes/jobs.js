import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { reports } from '../data/demoData.js';

const router = Router();

// GET /api/jobs/:id/status — Poll processing status
router.get('/:id/status', authenticate, (req, res) => {
    const report = reports.find(r => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: 'Job not found' });

    const statusOrder = ['QUEUED', 'EXTRACTING', 'ANALYZING', 'GENERATING', 'ASSEMBLING', 'READY'];
    const currentStep = statusOrder.indexOf(report.status);

    res.json({
        jobId: report.id,
        status: report.status,
        progress: report.status === 'READY' ? 100 : report.status === 'FAILED' ? 0 : Math.round((currentStep / (statusOrder.length - 1)) * 100),
        steps: statusOrder.map((s, i) => ({
            name: s,
            completed: i < currentStep,
            active: i === currentStep,
            pending: i > currentStep
        })),
        videoId: report.videoId,
        processingTime: report.processingTime
    });
});

export default router;
