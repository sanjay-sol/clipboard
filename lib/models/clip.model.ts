import { timeStamp } from "console";
import mongoose from "mongoose";

const ClipSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    text: {
        type: String,
    }
},{
    timestamps: true
}
);

const Clip = mongoose.models.Clip || mongoose.model("Clip2", ClipSchema);

export default Clip;