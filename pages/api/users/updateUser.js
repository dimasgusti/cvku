import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { template, email, username, title, country, bio, image, website, linkedIn, github, private: privateField } = req.body;

        try {
            if(!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const client = await clientPromise;
            const collection = client.db().collection("users");

            const user = await collection.findOne({ email });

            if(!user) {
                return res.status(404).json({ error: "User not found." });
            }

            if(username && username !== user.username) {
                const existingUsername = await collection.findOne({ username });

                if(existingUsername) {
                    return res.status(400).json({ error: "Username already taken." });
                }
            }

            const updateData = {
                ...(template && template !== user.template && { template}),
                ...(username && username !== user.username && { username }),
                ...(title && title !== user.title && { title }),
                ...(country && country !== user.country && { country }),
                ...(bio && bio !== user.bio && { bio }),
                ...(image && image !== user.image && { image }),
                ...(website && website !== user.website && { website }),
                ...(linkedIn && linkedIn !== user.linkedIn && { linkedIn }),
                ...(github && github !== user.github && { github }),
                ...(privateField !== user.private && { private: privateField }),
                updatedAt: new Date(),
            };

            const updateKeys = Object.keys(updateData).filter(key => key !== "updatedAt");
            if (updateKeys.length === 0) {
                return res.status(400).json({ error: "No changes made." });
            }

            const updatedUser = await collection.updateOne(
                { email },
                { $set: updateData }
            );

            if (updatedUser.modifiedCount === 0) {
                return res.status(400).json({ error: "No changes made." });
            }
            
            const updatedUserData = await collection.findOne({ email });
            return res.status(200).json(updatedUserData);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to update user." });
        }
    }
}