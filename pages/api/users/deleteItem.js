import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { email, type, itemId } = req.body;

        if (!email || !type || !itemId) {
            return res.status(400).json({ error: "Email, type, and itemId are required." });
        }

        try {
            const client = await clientPromise;
            const collection = client.db().collection("users");

            // Ensure the type matches project, education, etc.
            const updateResult = await collection.updateOne(
                { email, [`${type}._id`]: new ObjectId(itemId) },
                {
                    $pull: {
                        [type]: { _id: new ObjectId(itemId) }, // Pull the specific item from the array
                    },
                    $set: { updatedAt: new Date() }, // Update the timestamp
                }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ error: "Item not found or no changes made" });
            }

            return res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully` });
        } catch (error) {
            console.error("Error deleting item:", error);
            return res.status(500).json({ error: "An error occurred while deleting the item" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}