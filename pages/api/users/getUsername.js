import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { username } = req.query;

            if (!username) {
                return res.status(400).json({ error: "Username is required." });
            }

            const client = await clientPromise;
            const collection = client.db().collection("users");

            const user = await collection.findOne({ username });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            await collection.updateOne(
                { username },
                { 
                    $inc: { viewCount: 1 } 
                }
            )

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch user." });
        }
    }
}