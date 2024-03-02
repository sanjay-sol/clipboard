import mongoose, { Document, Model, Schema } from "mongoose";

interface ClipDocument extends Document {
  name: string;
  text?: string;
}

const ClipSchema: Schema<ClipDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Clip: Model<ClipDocument> =
  mongoose.models.newClip ||
  mongoose.model<ClipDocument>("newClip", ClipSchema);

export default Clip;
