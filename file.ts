import fs from "fs/promises";
import path from "path";

async function createFile() {
  await fs.writeFile("users.json", "Hi");
}

createFile();
