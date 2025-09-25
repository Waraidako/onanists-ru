

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");

}