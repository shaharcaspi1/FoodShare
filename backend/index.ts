import 'dotenv/config'
import express, { Request, Response } from "express";
import cors from 'cors';
import multer from 'multer';
import { v1 as documentai } from '@google-cloud/documentai';
import { error } from 'console';

const { DocumentProcessorServiceClient } = documentai;

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION || 'eu';
const PROCESSOR_ID = process.env.PROCESSOR_ID;
const GOOGLE_CREDS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!PROJECT_ID || !LOCATION || !PROCESSOR_ID){
    throw new Error("Missing DOC_AI_* env vars in .env")
}
if (!GOOGLE_CREDS){
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set; the SDK may not authenticate.');
}


const client = new DocumentProcessorServiceClient({apiEndpoint:`${LOCATION}-documentai.googleapis.com`});

app.get('/health', (_req: Request, res: Response) => {
    res.json({ok:true})
});

app.post('/process', upload.single('file'), async (req: Request, res: Response) =>{
    try {
        if (!req.file){
            return res.status(400).json({error: 'Missing file field "file".'})
        }

        const name = client.processorPath(PROJECT_ID!, LOCATION, PROCESSOR_ID!);
        const mimeType = req.file.mimetype;

        const request = {
            name,
            rawDocument: {
                content: req.file.buffer.toString('base64'),
                mimeType
            }
        };

        const [result] = await client.processDocument(request as any);
        res.json({ document: result.document })
    } catch (err: any) {
        console.error('Document AI error:',err)
        console.error('message:', err?.message);
        console.error('code:', err?.code, 'details:', err?.details);
        console.dir(err?.statusDetails, { depth: 10 });
        res.status(500).json({error: 'Failed to process document.'})
    }
});

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
})