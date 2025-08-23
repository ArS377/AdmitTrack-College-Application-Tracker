import { readFileSync, writeFileSync } from "fs";
import jsonata from "jsonata";

export async function mergeShortNames() {
  let data = readFileSync("data/collegedata.json", "utf8");
  const collegeData = JSON.parse(data);
  data = readFileSync("data/collegenames.json", "utf8");
  const collegeDataWithShortNames = JSON.parse(data);

  collegeData.map((itemA) => {
    itemA.searchWords = itemA.collegeName
      .toLowerCase()
      .split(/[ -]/)
      .filter((a) => a != "of" && a != "at" && a != "and")
      .sort();
    const itemB = collegeDataWithShortNames.find(
      (b) => b.unitId === itemA.unitId
    );
    if (itemB && itemB.shortNames) {
      itemB.shortNames = itemB.shortNames.map((a) => a.toLowerCase());
      itemA.searchWords = [
        ...new Set([...itemA.searchWords, ...itemB.shortNames]),
      ];
    }
    itemA.searchWords.sort();
  });
  console.log(`College Data Loaded. College Count: ${collegeData.length}`);
  console.log(JSON.stringify(collegeData, null, 2));
  writeFileSync("data/collegedata-merged.json", JSON.stringify(collegeData));
}

mergeShortNames();
