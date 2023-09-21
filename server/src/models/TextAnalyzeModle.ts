import { Schema } from "mongoose";
import { textAnalyzeDb } from "../config/db";

const TextAnalyzeSchema = new Schema({
    topWords: {
        type: Schema.Types.Mixed
    },
    topWordPairs: {
        type: Schema.Types.Mixed
    },
    wordFreq: {
        type: Schema.Types.Mixed
    },  
})

const TextAnalyzeModel = textAnalyzeDb.model("text", TextAnalyzeSchema)

export default TextAnalyzeModel