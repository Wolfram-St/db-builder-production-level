import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "schema_from_image.json"
  );

  const schema = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  return NextResponse.json(schema);
}
