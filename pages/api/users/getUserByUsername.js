import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";

async function getUserAndRecordsByUsername(username) {
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const recordsCollection = db.collection("records");

    // Fetch the user by username
    const user = await usersCollection.findOne(
      { username },
      {
        projection: {
          username: 1,
          title: 1,
          country: 1,
          bio: 1,
          email: 1,
          image: 1,
        },
      }
    );

    if (!user) {
      return { user: null, records: [] };
    }

    const records = await recordsCollection
      .find({ userId: user._id.toString() })
      .toArray();

    return { user, records };
  } catch (error) {
    console.error("Error querying user and records:", error.message);
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
      const { user, records } = await getUserAndRecordsByUsername(username);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user, records });
    } catch (error) {
      console.error("Error querying user and records:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}