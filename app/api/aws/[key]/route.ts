import { NextRequest, NextResponse } from "next/server";
import getPresignedUrl from "@/app/utils/getPresignedUrl";
import checkObjectExist from "@/app/utils/checkObjectExist";

const bucketName: string = process.env.AWS_BUCKET || "";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const reqUrl: string[] | undefined = req.url?.split("/");
    const key: string | undefined = reqUrl[5];
    if (!key) {
      return NextResponse.json({ error: "Key not provided" }, { status: 400 });
    }
    const exists: boolean = await checkObjectExist(bucketName, key);
    if (exists) {
      return NextResponse.json({ url: "" }, { status: 200 });
    }
    const url: string | undefined = await getPresignedUrl(key);
    if (!url) {
      return NextResponse.json(
        { error: "Failed to generate presigned URL" },
        { status: 500 }
      );
    }
    return NextResponse.json({ url: url }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
