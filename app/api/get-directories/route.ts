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
    directories.forEach((value: string[], key: string) => {
        directories.set(key, value.sort((a: string, b: string): number => {
            if (a.startsWith('README')) return -1;
            if (b.startsWith('README')) return 1;
            if (a.startsWith('Лекция') && b.startsWith('Лекция') ||
                a.startsWith('Семинар') && b.startsWith('Семинар')) {
                return (parseInt(a.split(' ')[1]) > parseInt(b.split(' ')[1]) ? 1 : -1);
            } else if (a.startsWith('Лекция')) return -1;
            else return 1;
        }))
    })
    return Response.json({ directories: JSON.stringify(Object.fromEntries(directories)) , status: 200, statusText: "OK" });
}