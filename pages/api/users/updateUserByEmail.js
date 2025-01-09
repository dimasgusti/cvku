import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const dbName = "cvku";

async function updateUserByEmail(email, updateData) {
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { username, title, country, bio, image, private: privateField } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (title !== undefined && title !== null) updateData.title = title;
    if (country !== undefined && country !== null) updateData.country = country;
    if (bio !== undefined && bio !== null) updateData.bio = bio;
    if (image) updateData.image = image;
    if (privateField !== undefined){
      updateData.private = privateField;
    }
    

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No fields provided to update." });
    }

    try {
      const result = await updateUserByEmail(email, updateData);

      if (result.modifiedCount === 0) {
        return res.status(304).json({ message: "No changes made to the user." });
      }

      res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
      console.error("Error updating user:", error.message);
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}