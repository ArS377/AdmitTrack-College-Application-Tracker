import { readFileSync, writeFileSync } from "fs";
import jsonata from "jsonata";

function extractAddressParts(address) {
  if (!address) return null;

  // Match: city (any chars), state (2 uppercase letters), ZIP (5-digit with optional -4)
  const regex = /,\s*([^,]+?)\s*,?\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/;
  const match = address.match(regex);

  if (!match) return null;

  let [, city, state, zip] = match;
  city = city.trim();
  return [city, state, zip];
}

export function mergeShortNames() {
  let data = readFileSync("data/collegedata.json", "utf8");
  const collegeData = JSON.parse(data);
  data = readFileSync("data/collegenames.json", "utf8");
  const collegeDataWithShortNames = JSON.parse(data);

  collegeData.map((itemA) => {
    if (itemA.info.address) {
      const [city, state, zip] = extractAddressParts(itemA.info.address);
      itemA.info.city = city;
      itemA.info.state = state;
      itemA.info.zip = zip;
    }

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
