import mongoose from "mongoose";

const options = {useNewUrlParser: true, useUnifiedTopology: true} as mongoose.ConnectOptions;

export const textAnalyzeDb = mongoose.createConnection(`mongodb://127.0.0.1:27017/primary
`, options);

textAnalyzeDb.once('open', () => {
    console.log("Database connection established!");
});