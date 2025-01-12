import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";

async function checkUsernameExists(username) {
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const userExists = await usersCollection.findOne({ username }, { projection: { _id: 1 } });

    return !!userExists;
  } catch (error) {
    console.error("Error checking username existence:", error.message);
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
      const exists = await checkUsernameExists(username.trim().toLowerCase());

      return res.status(200).json({ exists });
    } catch (error) {
      console.error("Error checking username:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}