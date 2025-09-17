import fs from 'fs';
import path from 'path';
import { Obsidian } from './../../utils/obsidian';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");
    const notePath: string | null = searchParams.get("path");
    if (!notePath) {
        return Response.json({ status: 400, statusText: "Note name not provided" });
    }
    console.log('Trying to get note with path:' + decodeURIComponent(notePath) + '.md');
    const note = (await obsidian.getFile(decodeURIComponent(notePath) + '.md')).toString();
    if (!note) {
        return Response.json({ status: 404, statusText: "Note not found" });
    }

    return Response.json({ status: 200, statusText: "OK", noteText: note});
}