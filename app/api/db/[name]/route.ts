import { NextRequest, NextResponse } from "next/server";
import { createClip, getClip } from "@/lib/actions/clip.action";
import { connectToDB } from "@/lib/mongoose";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const reqUrl: string[] | undefined = req.url?.split("/");
    const key: string | undefined = reqUrl[5];
    if (!key) {
      return NextResponse.json({ error: "Key not provided" }, { status: 400 });
    }
    const posts = await getClip(key);
    return NextResponse.json({ posts: posts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse> => {
  try {
    await connectToDB();
    const reqUrl: string | undefined = req.url?.split("/db/")[1];
    if (!reqUrl) {
      return NextResponse.json({ error: "URL not provided" }, { status: 400 });
    }
    const text: string = await req.text();
    const clipExist = await getClip(reqUrl);
    if (clipExist) {
      return NextResponse.json(
        { message: "Clip already exists" },
        { status: 400 }
      );
    }
    await createClip({ name: reqUrl, text: text });
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating clip", error },
      { status: 500 }
    );
  }
};
