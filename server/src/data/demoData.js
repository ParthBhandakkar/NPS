import { v4 as uuidv4 } from 'uuid';
import users from './users.js';

// Get patient user IDs
const patients = users.filter(u => u.role === 'patient');

const reports = [
    {
        id: uuidv4(),
        patientId: patients[0]?.id,
        patientName: 'Rajesh Kumar',
        doctorId: users.find(u => u.role === 'admin')?.id,
        fileName: 'blood_test_report_rajesh.pdf',
        fileSize: 245760,
        uploadedAt: '2025-02-20T09:15:00Z',
        status: 'READY',
        language: 'Hindi',
        literacyLevel: 'Basic',
        extractedData: {
            conditions: ['Type 2 Diabetes Mellitus'],
            medications: ['Metformin 500mg twice daily'],
            labResults: [
                { test: 'HbA1c', value: '8.2%', normalRange: '4.0-5.6%', status: 'High' },
                { test: 'Fasting Blood Glucose', value: '210 mg/dL', normalRange: '70-100 mg/dL', status: 'High' },
                { test: 'Cholesterol (Total)', value: '240 mg/dL', normalRange: '<200 mg/dL', status: 'Borderline High' }
            ]
        },
        explanation: {
            whatIsHappening: 'Your blood sugar levels are higher than normal. Think of blood sugar like fuel for your body — right now, there is too much fuel floating around and not enough being used properly.',
            whyItMatters: 'When blood sugar stays high for a long time, it can slowly damage important parts of your body like your eyes, kidneys, and heart. Taking action now can prevent these problems.',
            whatToDo: 'Take your Metformin medicine as your doctor prescribed — 500mg in the morning and 500mg in the evening with meals. Walk for 30 minutes daily. Reduce rice and sugar in your diet.',
            analogy: 'Imagine your blood vessels are like water pipes. High sugar is like sticky syrup flowing through those pipes — over time, it can clog them and cause damage. Medicine and diet help thin out the syrup.',
            audioScript: 'Namaste Rajesh ji. Aapke blood test ke results aaye hain...'
        },
        videoId: uuidv4(),
        videoUrl: '/api/videos/demo-video-1',
        processingTime: 45
    },
    {
        id: uuidv4(),
        patientId: patients[1]?.id,
        patientName: 'Priya Nair',
        doctorId: users.find(u => u.role === 'admin')?.id,
        fileName: 'thyroid_panel_priya.pdf',
        fileSize: 198400,
        uploadedAt: '2025-02-22T11:30:00Z',
        status: 'READY',
        language: 'English',
        literacyLevel: 'Advanced',
        extractedData: {
            conditions: ['Hypothyroidism'],
            medications: ['Levothyroxine 50mcg once daily'],
            labResults: [
                { test: 'TSH', value: '8.5 mIU/L', normalRange: '0.4-4.0 mIU/L', status: 'High' },
                { test: 'Free T4', value: '0.7 ng/dL', normalRange: '0.8-1.8 ng/dL', status: 'Low' },
                { test: 'Free T3', value: '2.1 pg/mL', normalRange: '2.3-4.2 pg/mL', status: 'Low' }
            ]
        },
        explanation: {
            whatIsHappening: 'Your thyroid gland, located in your neck, is underperforming. It is not producing enough hormones that regulate your metabolism, energy levels, and body temperature.',
            whyItMatters: 'Without adequate thyroid hormones, you may experience fatigue, weight gain, sensitivity to cold, and difficulty concentrating. Early treatment helps normalize these levels effectively.',
            whatToDo: 'Take Levothyroxine 50mcg every morning on an empty stomach, 30-60 minutes before breakfast. Avoid calcium or iron supplements within 4 hours of taking it. Follow up with blood work in 6 weeks.',
            analogy: 'Think of your thyroid as the thermostat of your body. Right now, the thermostat is set too low, so your body\'s "heating and energy systems" are running slower than they should.',
            audioScript: 'Hi Priya. Your thyroid panel results are back...'
        },
        videoId: uuidv4(),
        videoUrl: '/api/videos/demo-video-2',
        processingTime: 38
    },
    {
        id: uuidv4(),
        patientId: patients[0]?.id,
        patientName: 'Rajesh Kumar',
        doctorId: users.find(u => u.role === 'admin')?.id,
        fileName: 'liver_function_test_rajesh.pdf',
        fileSize: 156672,
        uploadedAt: '2025-03-01T14:45:00Z',
        status: 'ASSEMBLING',
        language: 'Hindi',
        literacyLevel: 'Basic',
        extractedData: {
            conditions: ['Mild Fatty Liver'],
            medications: [],
            labResults: [
                { test: 'ALT (SGPT)', value: '65 U/L', normalRange: '7-56 U/L', status: 'High' },
                { test: 'AST (SGOT)', value: '48 U/L', normalRange: '10-40 U/L', status: 'High' },
                { test: 'GGT', value: '72 U/L', normalRange: '9-48 U/L', status: 'High' }
            ]
        },
        explanation: null,
        videoId: null,
        videoUrl: null,
        processingTime: null
    },
    {
        id: uuidv4(),
        patientId: patients[1]?.id,
        patientName: 'Priya Nair',
        doctorId: users.find(u => u.role === 'admin')?.id,
        fileName: 'cbc_report_priya.pdf',
        fileSize: 134200,
        uploadedAt: '2025-03-02T08:20:00Z',
        status: 'EXTRACTING',
        language: 'English',
        literacyLevel: 'Advanced',
        extractedData: null,
        explanation: null,
        videoId: null,
        videoUrl: null,
        processingTime: null
    }
];

const auditLogs = [
    { id: uuidv4(), action: 'REPORT_UPLOADED', userId: users.find(u => u.role === 'admin')?.id, userName: 'Dr. Ananya Sharma', target: 'blood_test_report_rajesh.pdf', timestamp: '2025-02-20T09:15:00Z', ip: '103.42.58.12' },
    { id: uuidv4(), action: 'EXTRACTION_COMPLETE', userId: 'system', userName: 'System', target: 'blood_test_report_rajesh.pdf', timestamp: '2025-02-20T09:15:22Z', ip: 'internal' },
    { id: uuidv4(), action: 'VIDEO_GENERATED', userId: 'system', userName: 'System', target: 'blood_test_report_rajesh.pdf', timestamp: '2025-02-20T09:16:05Z', ip: 'internal' },
    { id: uuidv4(), action: 'VIDEO_ACCESSED', userId: patients[0]?.id, userName: 'Rajesh Kumar', target: 'Video: Diabetes Report Explanation', timestamp: '2025-02-20T10:30:00Z', ip: '103.42.58.45' },
    { id: uuidv4(), action: 'REPORT_UPLOADED', userId: users.find(u => u.role === 'admin')?.id, userName: 'Dr. Ananya Sharma', target: 'thyroid_panel_priya.pdf', timestamp: '2025-02-22T11:30:00Z', ip: '103.42.58.12' },
    { id: uuidv4(), action: 'VIDEO_GENERATED', userId: 'system', userName: 'System', target: 'thyroid_panel_priya.pdf', timestamp: '2025-02-22T11:31:08Z', ip: 'internal' },
    { id: uuidv4(), action: 'PATIENT_REGISTERED', userId: 'system', userName: 'System', target: 'Priya Nair', timestamp: '2025-02-10T14:15:00Z', ip: 'internal' },
    { id: uuidv4(), action: 'REPORT_UPLOADED', userId: users.find(u => u.role === 'admin')?.id, userName: 'Dr. Ananya Sharma', target: 'liver_function_test_rajesh.pdf', timestamp: '2025-03-01T14:45:00Z', ip: '103.42.58.12' },
    { id: uuidv4(), action: 'REPORT_UPLOADED', userId: users.find(u => u.role === 'admin')?.id, userName: 'Dr. Ananya Sharma', target: 'cbc_report_priya.pdf', timestamp: '2025-03-02T08:20:00Z', ip: '103.42.58.12' },
];

export { reports, auditLogs };
