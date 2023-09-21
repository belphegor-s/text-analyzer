import { Request, Response } from "express";
import TextAnalyzeModel from "../models/TextAnalyzeModle";
import validObj from "../utils/validObj";

export const textAnalyze = async (req: Request, res: Response) => {
    let success = false, msg = '', status = 200, data: any = {};

    if (!req.file) {
        status = 400;
        msg = 'No file uploaded'
        return res.status(status).json({ success, msg });
    }

    const text = req.file.buffer.toString();

    if(!text || !(text.trim())) {
        status = 400;
        msg = 'File empty! No words found'
        return res.status(status).json({ success, msg });
    }

    const tokens = text.split(/\s+/).filter((token) => token.length > 0);

    const wordFreq: { [word: string]: number } = {};
    for (const token of tokens) {
        wordFreq[token] = (wordFreq[token] || 0) + 1;
    }

    const sortedWordFreq = Object.entries(wordFreq).sort(
        ([, freqA], [, freqB]) => freqB - freqA
    );

    const topWords = Object.fromEntries(sortedWordFreq.slice(0, 5));

    const wordPairsFreq: { [wordPair: string]: number } = {};
    for (let i = 0; i < tokens.length - 1; i++) {
        const wordPair = `${tokens[i]} ${tokens[i + 1]}`;
        wordPairsFreq[wordPair] = (wordPairsFreq[wordPair] || 0) + 1;
    }

    const sortedWordPairsFreq = Object.entries(wordPairsFreq).sort(
        ([, freqA], [, freqB]) => freqB - freqA
    );

    const topWordPairs = Object.fromEntries(sortedWordPairsFreq.slice(0, 5));

    success = true;
    msg = 'Successfully evaluated file'
    data = {
        topWords,
        topWordPairs,
        wordFreq,
    }

    try {
        const newTextData = new TextAnalyzeModel(data);
        await newTextData.save();
    } catch(e) {
        console.log(`Error saving data in DB -> `, e);
        success = false
        status = 500
        msg = 'Internal Server Error!'
    }

    res.status(status).json({ success, msg, ...validObj(data) ? { data } : {}});
}

export const textAnalyzeData = async (req: Request, res: Response) => {
    let success = false, msg = '', status = 200, data: any = [];

    try {
        data = await TextAnalyzeModel.find({});
        if(data && data.length >= 0) {
            success = true;
            msg = 'Successfully fetched previous uploads'
        }
    } catch(e) {
        console.log(`Error fetching data from DB -> `, e);
        success = false
        status = 500
        msg = 'Internal Server Error!'
    } finally {
        res.status(status).json({ success, msg, ...(data?.length > 0) ? { data } : {}});
    }
}