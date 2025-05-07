import { NextResponse } from "next/server";
import { join } from "path";
import { readFile, unlink } from "fs/promises";
import { existsSync } from "fs";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  try {
    const filePath = join(process.cwd(), "tmp", filename);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file content
    const fileBuffer = await readFile(filePath);

    // Delete the file after reading to clean up
    await unlink(filePath).catch((err) =>
      console.error("Failed to delete file:", err)
    );

    // Set response headers for file download
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
