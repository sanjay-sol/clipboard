import { NextRequest, NextResponse } from "next/server";
import getPresignedUrl from "@/app/utils/getPresignedUrl";
import checkObjectExist from "@/app/utils/checkObjectExist";

const bucketName = "clipboard2";

export const GET = async(req: NextRequest, res: NextResponse) => {
    try {
        const reqUrl = req.url?.split('/');
        const key = reqUrl[5];
        const exists = await checkObjectExist(bucketName, key);
        const url = await getPresignedUrl(key);
        if (!exists) {
            return NextResponse.json({ url :"" }, { status: 200 });
        }
    return NextResponse.json({ url: url }, { status: 200 }); 
    } catch (error : any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
   
}

