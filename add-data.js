const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

require("dotenv").config({ path: "./backend/config.env" });

const client = new MongoClient(process.env.ATLAS_URI);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db("collegeapp");
    return database; // Return the connected database instance.
  } catch (e) {
    console.error("MongoDB connection failed:", e);
    throw e;
  }
}

async function getCollegeDataFromJson(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const collegesObject = JSON.parse(data); //Javascript Object
    
    const collegeDocuments = Object.keys(collegesObject).map(collegeName => {
      const collegeDetails = collegesObject[collegeName];
      return {
        collegeName: collegeName,
        unitId: collegeDetails["Unit ID"],
        location: collegeDetails.Location,
        homepage: collegeDetails.Homepage,
        acceptanceRate: collegeDetails["Acceptance Rate"],

        satScores: {
          reading25: collegeDetails["SAT Reading 25%"],
          reading50: collegeDetails["SAT Reading 50%"],
          reading75: collegeDetails["SAT Reading 75%"],
          math25: collegeDetails["SAT Math 25%"],
          math50: collegeDetails["SAT Math 50%"],
          math75: collegeDetails["SAT Math 75%"]
        },

        actScores: {
          composite25: collegeDetails["ACT Composite 25%"],
          composite50: collegeDetails["ACT Composite 50%"],
          composite75: collegeDetails["ACT Composite 75%"]
        }
      };
    });

    return collegeDocuments;
  } catch (error) {
    console.error(`Error reading or parsing JSON file ${filePath}:`, error);
    throw error;
  }
}

async function run() { //runs code immediately instead of waiting for POST request
    db = await connectToDatabase();
    const collection = db.collection('collegeinfo');

    const path = 'data.json';
    const collegeData = await getCollegeDataFromJson(path);

    if (collegeData.length === 0) {
      console.log('No college data found in JSON file');
      return;
    }

    console.log(`Inserting ${collegeData.length} colleges`);
    const insertManyResult = await collection.insertMany(collegeData);
    console.log(`Successfully inserted ${insertManyResult.insertedCount} colleges`);
}

run();
