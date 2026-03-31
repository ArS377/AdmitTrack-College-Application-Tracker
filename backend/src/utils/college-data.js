import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = readFileSync(join(__dirname, "../../data/collegedata-merged.json"), "utf8");
const collegeData = JSON.parse(data);
console.log(`College Data Loaded. College Count: ${collegeData.length}`);

export default function getCollegeData() {
  return collegeData;
}
