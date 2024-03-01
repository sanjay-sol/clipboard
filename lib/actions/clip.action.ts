import Clip from "../models/clip.model";
import { connectToDB } from "../mongoose";
interface Params {
  name: string;
  text: string;
}
//J90FaiMQ3A2t8M3r

export async function createClip({ name, text }: Params): Promise<void> {
  try {
    await connectToDB();
    await Clip.create({ name: name.toLowerCase(), text: text });
  } catch (error: any) {
    throw new Error(`Failed to create clip: ${error.message}`);
  }
}

export async function getClip(name: string): Promise<any> {
  try {
    await connectToDB();
    const clip = await Clip.findOne({ name: name.toLowerCase() });
    return clip;
  } catch (error: any) {
    throw new Error(`Failed to get clip: ${error.message}`);
  }
}
