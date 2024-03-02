import { NextRequest, NextResponse } from "next/server";
import { createClip , getClip } from "@/lib/actions/clip.action";
import { connectToDB } from "@/lib/mongoose";

export const GET = async(req: NextRequest, res: NextResponse) => {
    try {
        const reqUrl = req.url?.split('/');
        const key = reqUrl[5];
        const posts = await getClip(key);
    return NextResponse.json({ posts : posts }, { status: 200 }); 
    } catch (error : any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const POST = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
  try {
      await connectToDB();
      const reqUrl = req.url?.split('/db/')[1];
      const text = await req.text();
      console.log("text---", text)
      const clipExist = await getClip(reqUrl);
      if (clipExist) {
            return NextResponse.json({ message: "Clip already exist" }, { status: 400 });
      }
      await createClip({ name : reqUrl, text : text });
      return NextResponse.json({ message : "Success" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ message: "error creating clip", error }, { status: 500 });
    }
};
