export async function getUserData(email, db) {
  console.log("getting user data for email:", email);
  const collection = db.collection("userdata");
  return await collection.find({ email: email }).toArray();
}
