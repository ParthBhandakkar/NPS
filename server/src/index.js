import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import jobRoutes from './routes/jobs.js';
import videoRoutes from './routes/videos.js';
import patientRoutes from './routes/patients.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'MedExplainer AI API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ MedExplainer AI server running on http://localhost:${PORT}`);
});
