import { NextRequest, NextResponse } from "next/server";
import getPresignedUrl from "@/app/utils/getPresignedUrl";

export const GET = async(req: NextRequest, res: NextResponse) => {

    const reqUrl = req.url?.split('/');
    const key = reqUrl[5];
    const url = await getPresignedUrl(key);

    return NextResponse.json({ url: url }, { status: 200 });
}