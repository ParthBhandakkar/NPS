import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Pre-hashed passwords — generated at module load
const adminHash = bcrypt.hashSync('admin123', 10);
const patientHash = bcrypt.hashSync('patient123', 10);
const patient2Hash = bcrypt.hashSync('patient123', 10);

const users = [
    {
        id: uuidv4(),
        name: 'Dr. Ananya Sharma',
        email: 'admin@medexplainer.ai',
        password: adminHash,
        role: 'admin',
        specialization: 'General Medicine',
        hospital: 'Apollo Hospitals, Mumbai',
        createdAt: '2025-01-15T09:00:00Z'
    },
    {
        id: uuidv4(),
        name: 'Rajesh Kumar',
        email: 'patient@medexplainer.ai',
        password: patientHash,
        role: 'patient',
        age: 45,
        language: 'Hindi',
        literacyLevel: 'Basic',
        createdAt: '2025-02-01T10:30:00Z'
    },
    {
        id: uuidv4(),
        name: 'Priya Nair',
        email: 'priya@example.com',
        password: patient2Hash,
        role: 'patient',
        age: 32,
        language: 'English',
        literacyLevel: 'Advanced',
        createdAt: '2025-02-10T14:15:00Z'
    }
];

export default users;
