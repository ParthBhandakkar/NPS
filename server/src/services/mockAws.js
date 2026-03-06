// Mock AWS Services Layer
// In production, replace these with actual AWS SDK calls

import { v4 as uuidv4 } from 'uuid';

// Simulate Amazon Textract — extract text from medical PDF
export async function mockTextract(fileName) {
    await delay(1500);
    return {
        service: 'Amazon Textract',
        documentId: uuidv4(),
        pages: 2,
        extractedText: 'Patient medical report content extracted successfully.',
        tables: [
            { name: 'Lab Results', rows: 5, columns: 4 }
        ],
        keyValuePairs: [
            { key: 'Patient Name', value: 'Extracted from document' },
            { key: 'Date of Report', value: new Date().toISOString().split('T')[0] },
            { key: 'Lab ID', value: 'LAB-' + Math.floor(Math.random() * 99999) }
        ],
        confidence: 0.97
    };
}

// Simulate Amazon Comprehend Medical — detect clinical entities
export async function mockComprehendMedical(text) {
    await delay(1200);
    const conditionPool = [
        'Type 2 Diabetes Mellitus', 'Hypothyroidism', 'Hypertension',
        'Iron Deficiency Anemia', 'Vitamin D Deficiency', 'Mild Fatty Liver',
        'Urinary Tract Infection', 'Bronchial Asthma'
    ];
    const medicationPool = [
        'Metformin 500mg', 'Levothyroxine 50mcg', 'Amlodipine 5mg',
        'Ferrous Sulfate 325mg', 'Cholecalciferol 60000 IU', 'Pantoprazole 40mg'
    ];

    return {
        service: 'Amazon Comprehend Medical',
        entities: {
            conditions: [conditionPool[Math.floor(Math.random() * conditionPool.length)]],
            medications: [medicationPool[Math.floor(Math.random() * medicationPool.length)]],
            anatomy: ['Blood', 'Liver'],
            testResults: [
                { test: 'Hemoglobin', value: (10 + Math.random() * 6).toFixed(1) + ' g/dL', status: 'Normal' },
                { test: 'WBC Count', value: (4000 + Math.random() * 8000).toFixed(0) + ' /µL', status: 'Normal' }
            ]
        },
        icd10Codes: ['E11.9', 'E03.9'],
        confidence: 0.94
    };
}

// Simulate Amazon Bedrock (Claude) — generate patient explanation
export async function mockBedrock(clinicalData, patientProfile) {
    await delay(2000);
    return {
        service: 'Amazon Bedrock (Claude 3 Sonnet)',
        modelId: 'anthropic.claude-3-sonnet',
        explanation: {
            whatIsHappening: `Based on your medical report, your doctor has identified some areas that need attention. Your test results show values that are outside the normal range, which means your body needs some extra help right now.`,
            whyItMatters: `Understanding your health condition is the first step to getting better. When these values are not in the normal range, it can affect how you feel day-to-day and your long-term health if not managed properly.`,
            whatToDo: `Follow your doctor's prescribed treatment plan carefully. Take your medications as directed, maintain a balanced diet, stay physically active with light exercise, and come back for your follow-up appointment as scheduled.`,
            analogy: `Think of your body like a garden. Right now, some plants need extra water and care. With the right attention — medicine, diet, and exercise — your garden will flourish again.`,
            audioScript: `Hello! Your medical report results are ready. Let me explain what they mean in simple terms...`
        },
        tokensUsed: 1247,
        latencyMs: 2000
    };
}

// Simulate Amazon Polly — text-to-speech
export async function mockPolly(text, language) {
    await delay(800);
    return {
        service: 'Amazon Polly (Neural TTS)',
        voice: language === 'Hindi' ? 'Kajal' : 'Aditi',
        language: language,
        format: 'mp3',
        durationSeconds: Math.floor(30 + Math.random() * 60),
        sampleRate: '24000',
        audioUrl: '/mock-audio/narration.mp3'
    };
}

// Simulate video assembly via FFmpeg Lambda
export async function mockVideoAssembly(audioData, explanationData) {
    await delay(1500);
    return {
        service: 'FFmpeg Lambda Layer',
        videoId: uuidv4(),
        format: 'mp4',
        resolution: '1280x720',
        durationSeconds: audioData.durationSeconds + 10,
        fileSize: Math.floor(5 + Math.random() * 15) + ' MB',
        subtitles: true,
        bodyDiagramOverlay: true
    };
}

// Run the full pipeline in stages
export async function runPipeline(report, onStatusChange) {
    const stages = [
        { status: 'EXTRACTING', fn: () => mockTextract(report.fileName), delay: 0 },
        { status: 'ANALYZING', fn: () => mockComprehendMedical('extracted text'), delay: 0 },
        { status: 'GENERATING', fn: () => mockBedrock({}, { language: report.language }), delay: 0 },
        {
            status: 'ASSEMBLING', fn: async () => {
                const polly = await mockPolly('script', report.language);
                return mockVideoAssembly(polly, {});
            }, delay: 0
        }
    ];

    for (const stage of stages) {
        onStatusChange(stage.status);
        try {
            const result = await stage.fn();
            if (stage.status === 'GENERATING' && result.explanation) {
                report.explanation = result.explanation;
            }
            if (stage.status === 'ASSEMBLING' && result.videoId) {
                report.videoId = result.videoId;
                report.videoUrl = `/api/videos/${result.videoId}`;
            }
        } catch (err) {
            onStatusChange('FAILED');
            return;
        }
    }

    onStatusChange('READY');
    report.processingTime = Math.floor(20 + Math.random() * 40);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
