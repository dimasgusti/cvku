import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({ error: "Email is required." });
            }

            const client = await clientPromise;
            const collection = client.db().collection("users");

            const user = await collection.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch user." });
        }
    }
}