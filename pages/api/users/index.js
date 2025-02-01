import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const collection = client.db().collection("users");
            const users = await collection.find({}).toArray();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users data:", error);
            res.status(500).json({ error: "Failed to fetch users data." });
        }
    }
}