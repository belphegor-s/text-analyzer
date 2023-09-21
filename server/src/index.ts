import { config } from "dotenv";
config();
const PORT = process.env?.PORT ?? 8080;

import express from "express";
import cors from "cors";
import textAnalyzeRoutes from "./routes/text-analyze";
import "./config/db";
const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Server is live 🍵');
});
app.use(textAnalyzeRoutes);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
