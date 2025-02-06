import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {

    if (req.method === "DELETE") {
        const { email, langName } = req.body;

        if (!langName || !email) {
            return res.status(400).json({ error: "Email and language are required." });
        }

        try {
            const client = await clientPromise;
            const collection = client.db().collection("users");

            const updateResult = await collection.updateOne(
                { email },
                {
                  $pull: { languages: { langName } },
                  $set: { updatedAt: new Date() },
                }
              );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ error: "User not found or no changes made" });
            }

            return res.status(200).json({ message: "Language updated successfully" });
        } catch (error) {
            console.error("Error updating language:", error);
            return res.status(500).json({ error: "An error occurred while updating language" });
        }
    }
}