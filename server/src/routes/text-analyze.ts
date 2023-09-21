import { Request, Response, NextFunction, Router } from "express"
import { textAnalyze, textAnalyzeData } from "../controller/text-analyze";
import multer from "multer";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // max 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
            cb(null, true);
        } else {
            cb(new Error('Only .txt files are allowed'));
        }
    },
});

router.post('/text-analyze', upload.single('file'), textAnalyze)
router.get('/text-analyze-data', textAnalyzeData)

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let success = false, msg = '';
    if (err instanceof multer.MulterError) {
        msg = 'File upload error -> ' + err.message
        return res.status(400).json({ success, msg });
    } else if (err) {
        msg = err.message
        return res.status(400).json({ success, msg });
    }
    next();
});

export default router;