import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
    {},
    {
        strict: false,
        collection: "data"
    }
);

const EVData = mongoose.model("EVData", dataSchema);

export default EVData;