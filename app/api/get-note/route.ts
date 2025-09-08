import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const noteLocalPath: string | null = searchParams.get("path");
    if (!noteLocalPath) {
        return Response.json({ status: 400, statusText: "Note name not provided" });
    }
    const noteAbsolutePath: string = path.join(process.cwd(), 'public/files', decodeURIComponent(noteLocalPath));
    if (!fs.existsSync(noteAbsolutePath)) {
        return Response.json({ status: 404, statusText: "Note not found" });
    }
    const note: string = fs.readFileSync(noteAbsolutePath, 'utf8');

    return Response.json({ status: 200, statusText: "OK", noteText: note});
}