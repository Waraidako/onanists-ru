//import { parseNoteFileNames } from "@/app/utils/DirectoryParser";
import { Obsidian } from "../../utils/obsidian";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dirName: string | null = searchParams.get("dir");
    if (!dirName) {
        return Response.json({ status: 400, statusText: "No directory name provided" });
    }

    const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
    const data: string[] = [];
    const allPaths: string[] = await obsidian.getAllFilesList();
    allPaths.forEach((path: string) => {
        const splitPath = path.split("/");
        if (splitPath.length < 2) { return; }
        if (splitPath[0] === dirName && splitPath[1] !== "Пикчи") {
            data.push(splitPath[1].split(".").slice(0, -1).join("."));
        }
    })

    //const data: string[] = parseNoteFileNames(decodeURIComponent(dirName));
    if (!data) return Response.json({status: 404, statusText: "Directory not found"});
    const noteFilenames = data.sort((a: string, b: string): number => {
        if (a.startsWith('README')) return -1;
        if (b.startsWith('README')) return 1;
        if (a.startsWith('Лекция') && b.startsWith('Лекция') ||
            a.startsWith('Семинар') && b.startsWith('Семинар')) {
            return (parseInt(a.split(' ')[1]) > parseInt(b.split(' ')[1]) ? 1 : -1);
        } else if (a.startsWith('Лекция')) return -1;
        else return 1;
    });
    return Response.json({ files: noteFilenames , status: 200, statusText: "OK" });
}
