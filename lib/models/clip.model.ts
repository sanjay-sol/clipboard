import { timeStamp } from "console";
import mongoose from "mongoose";

const Clip_Schema = new mongoose.Schema({
    name: {
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

const Clip = mongoose.models.newClip || mongoose.model("newClip", Clip_Schema);

export default Clip;