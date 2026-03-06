# Real AI Model Setup Guide

This document lists every process in the current pipeline, where it is mocked today, and exactly what needs to be set up to make each part production-ready with real AI services.

---

## 1) File Upload (PDF -> S3)

### Current mock location
- `server/src/routes/reports.js`
- Today, no actual file is uploaded. Client sends JSON with `fileName` only.

### What to set up
- Create S3 bucket for source reports (example: `medexplainer-reports`)
- Add IAM permissions:
  - `s3:PutObject`
  - `s3:GetObject`
- Install packages:
  - `@aws-sdk/client-s3`
  - `@aws-sdk/s3-request-presigner`
  - `multer` (for multipart uploads)
- Implement either:
  - Pre-signed upload URL flow, or
  - Direct upload via Express + Multer
- Store report `s3Key` in report records (instead of only `fileName`)

### Env vars
```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_REPORTS=medexplainer-reports
```

---

## 2) Text Extraction (PDF -> extracted text/tables)

### Current mock location
- `server/src/services/mockAws.js` -> `mockTextract()`
- Returns fake extraction output with delay.

### What to set up
- Enable AWS Textract in your AWS account/region
- Add IAM permissions:
  - `textract:AnalyzeDocument`
  - `textract:StartDocumentAnalysis`
- Install package:
  - `@aws-sdk/client-textract`
- Replace mock function with real Textract calls and parse `Blocks`
- Feed S3 object info to Textract

### Env vars
```env
AWS_REGION=ap-south-1
```

---

## 3) Clinical Entity Extraction (medical NLP)

### Current mock location
- `server/src/services/mockAws.js` -> `mockComprehendMedical()`
- Uses random condition/medication pools.

### What to set up
- Enable AWS Comprehend Medical
- Add IAM permissions:
  - `comprehendmedical:DetectEntitiesV2`
  - `comprehendmedical:InferICD10CM`
- Install package:
  - `@aws-sdk/client-comprehendmedical`
- Replace mock with real entity extraction
- Parse entity categories:
  - Conditions
  - Medications
  - Tests
  - Anatomy
- Optionally run ICD-10 inference

---

## 4) AI Explanation Generation (LLM)

### Current mock location
- `server/src/services/mockAws.js` -> `mockBedrock()`
- Returns static explanation text.

### What to set up
- Enable AWS Bedrock and request model access (Claude)
- Add IAM permission:
  - `bedrock:InvokeModel`
- Install package:
  - `@aws-sdk/client-bedrock-runtime`
- Create robust prompt with:
  - Extracted clinical entities
  - Patient language
  - Literacy level
- Force structured JSON output with keys:
  - `whatIsHappening`
  - `whyItMatters`
  - `whatToDo`
  - `analogy`
  - `audioScript`

### Env vars
```env
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

---

## 5) Text-to-Speech (Narration)

### Current mock location
- `server/src/services/mockAws.js` -> `mockPolly()`
- Returns fake metadata only.

### What to set up
- Enable AWS Polly
- Add IAM permission:
  - `polly:SynthesizeSpeech`
- Install package:
  - `@aws-sdk/client-polly`
- Convert generated `audioScript` into MP3
- Choose voice by language (Hindi/English/etc.)
- Save generated audio to S3

---

## 6) Video Assembly (audio + visuals -> MP4)

### Current mock location
- `server/src/services/mockAws.js` -> `mockVideoAssembly()`
- Returns fake video metadata.

### What to set up (choose one)

#### Option A: Lambda + FFmpeg
- Lambda function with FFmpeg layer
- Input: audio key, subtitle text, assets
- Output: MP4 to S3
- IAM: `lambda:InvokeFunction`, S3 object permissions

#### Option B: MediaConvert
- Configure MediaConvert pipeline
- Create job template for MP4 assembly
- IAM: `mediaconvert:CreateJob`

#### Option C: Server-side FFmpeg
- Use `fluent-ffmpeg` on server
- Requires FFmpeg binary on host
- Good for small workloads / prototypes

---

## 7) Video Delivery (secure playback URL)

### Current mock location
- `server/src/routes/videos.js`
- Returns hardcoded fake CloudFront URL.

### What to set up
- Create video bucket (example: `medexplainer-videos`)
- Optional CloudFront distribution for delivery
- Generate pre-signed read URLs per request
- Install package:
  - `@aws-sdk/s3-request-presigner`
- Return expiring URLs in API responses

### Env vars
```env
S3_BUCKET_VIDEOS=medexplainer-videos
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net
VIDEO_URL_EXPIRY=3600
```

---

## 8) Pipeline Orchestration

### Current location
- `server/src/services/mockAws.js` -> `runPipeline()`
- Sequential in-process execution.

### Production options
- **Best**: AWS Step Functions
  - Built-in retries, observability, state transitions
- **Scalable**: SQS + Lambda workers
- **Simple**: Keep in-process (only for low traffic)

---

## Single Source of Mock Logic

All AI/AWS mocks are centralized in:
- `server/src/services/mockAws.js`

Primary route needing update for delivery URLs:
- `server/src/routes/videos.js`

---

## Install List (server)

```bash
npm install \
  @aws-sdk/client-s3 \
  @aws-sdk/s3-request-presigner \
  @aws-sdk/client-textract \
  @aws-sdk/client-comprehendmedical \
  @aws-sdk/client-bedrock-runtime \
  @aws-sdk/client-polly \
  @aws-sdk/client-lambda \
  @aws-sdk/client-sfn \
  multer
```

---

## Process-by-Process Mapping Table

| # | Process | Current Mock | Target Service |
|---|--------|--------------|----------------|
| 1 | Upload | `reports.js` JSON fileName | S3 + Multer/Presigned Upload |
| 2 | Extraction | `mockTextract()` | AWS Textract |
| 3 | Medical NLP | `mockComprehendMedical()` | AWS Comprehend Medical |
| 4 | Explanation | `mockBedrock()` | AWS Bedrock (Claude) |
| 5 | Narration | `mockPolly()` | AWS Polly |
| 6 | Video Build | `mockVideoAssembly()` | Lambda+FFmpeg / MediaConvert |
| 7 | Delivery URL | `videos.js` fake URL | S3 Signed URL (+CloudFront optional) |
| 8 | Orchestration | `runPipeline()` in-process | Step Functions / SQS+Lambda |

---

## Practical Rollout Order (recommended)

1. Real file upload to S3
2. Real Textract extraction
3. Real Bedrock explanation
4. Real Polly audio
5. Basic FFmpeg video output
6. Signed video URLs
7. Move orchestration to Step Functions
8. Add monitoring, retries, and alerts

---

## Current Backend Reality Check

- App is currently **fully demo-capable**
- Data is **in-memory** and resets on restart
- AI pipeline is **mocked**, not calling real AWS yet
- This guide is the complete checklist to transition to production AI
