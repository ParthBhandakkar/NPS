import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { reports } from '../data/demoData.js';

const router = Router();

// GET /api/videos/:id/url — Get pre-signed URL for video
router.get('/:id/url', authenticate, (req, res) => {
    const report = reports.find(r => r.videoId === req.params.id);
    if (!report) return res.status(404).json({ error: 'Video not found' });
    if (report.status !== 'READY') {
        return res.status(400).json({ error: 'Video is not ready yet', status: report.status });
    }

    // In production, generate a real pre-signed S3 URL
    res.json({
        videoId: report.videoId,
        url: `https://d1234567890.cloudfront.net/videos/${report.videoId}.mp4`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        report: {
            id: report.id,
            fileName: report.fileName,
            patientName: report.patientName,
            language: report.language,
            explanation: report.explanation,
            extractedData: report.extractedData,
            processingTime: report.processingTime
        }
    });
});

export default router;
