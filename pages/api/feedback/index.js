import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const collection = client.db().collection("feedbacks");

        if (req.method === "GET") {
            const feedbacks = await collection.find({}).toArray();
            return res.status(200).json(feedbacks);
        } 
        
        else if (req.method === "POST") {
            const { name, message } = req.body;

            if (!message) {
                return res.status(400).json({ error: "Message is required." });
            }

            const newFeedback = {
                name,
                message,
                createdAt: new Date(),
            };

            const result = await collection.insertOne(newFeedback);
            return res.status(201).json({ message: "Feedback delivered:", result });
        } 
        
        else {
            return res.status(405).json({ error: "Method not allowed." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
}