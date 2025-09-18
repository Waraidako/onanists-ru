import { Obsidian } from '@/app/utils/obsidian';

export async function GET(request: Request, { params }: { params: { slug: string[] } }){
    return Response.json({ status: 200, statusText: "OK" });

    const { slug } = params;
    const pictureName = decodeURIComponent(slug[0]);
    const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
    const files: string[] = await obsidian.getAllFilesList();
    const picturePath = files.find(str => str.includes(pictureName))!;
    console.log(picturePath);
    return await obsidian.getFile(picturePath);
}