//import { parseNoteFileNames } from "@/app/utils/DirectoryParser";
import { Obsidian } from "../../utils/obsidian";

export async function GET() {
    const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
    const allPaths: string[] = await obsidian.getAllFilesList();
    const directories: Map<string, string[]> = new Map<string, string[]>();
    allPaths.forEach((path: string) => {
        const splitPath = path.split("/");
        if (splitPath.length < 2) { return; }
        if (splitPath[1] === "Пикчи") { return; }
        if (directories.get(splitPath[0]) === undefined) { directories.set(splitPath[0], []) }
        directories.get(splitPath[0])!.push(splitPath[1].split(".").slice(0, -1).join('.'));
    })
    return Response.json({ directories: JSON.stringify(Object.fromEntries(directories)) , status: 200, statusText: "OK" });
}


// const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
// console.log("api hit");
// const allPaths: string[] = await obsidian.getAllFilesList();
// const directories: Map<string, string[]> = new Map<string, string[]>();
// allPaths.forEach((path: string) => {
//     const splitPath = path.split("/");
//     if (splitPath.length < 2) { return; }
//     if (splitPath[1] === "Пикчи") { return; }
//     if (directories.get(splitPath[0]) === undefined) { directories.set(splitPath[0], []) }
//     directories.get(splitPath[0])!.push(splitPath[1].split(".").slice(0, -1).join('.'));
// })