import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";

async function getUserByUsername(username) {
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username }, {
      projection: { username: 1 } 
    });

    return user;
  } catch (error) {
    console.error("Error querying user by username:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    try {
      const user = await getUserByUsername(username);

      if (user) {
        return res.status(200).json({ exists: true, message: "Username is already taken" });
      } else {
        return res.status(200).json({ exists: false, message: "Username is available" });
      }
    } catch (error) {
      console.error("Error querying user by username:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}