import { Obsidian } from '@/app/utils/obsidian';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const picturePath = decodeURIComponent(searchParams.get("path")!);
    const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
    const pathSplit = picturePath!.split('.');
    const extension = pathSplit[pathSplit.length - 1] == 'png' ? 'png' : 'jpeg';
    const picture: Buffer<ArrayBuffer> = await obsidian.getFile((picturePath)) as Buffer<ArrayBuffer>;
    return new Response(picture, {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": `image/${extension}`,
            "Content-Length": picture.length.toString(),
            "Cache-Control": "public, max-age=3600"
        },
    });
}