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

            const updateData = {};
            if (req.body.hasOwnProperty("template") && template !== user.template) {
                updateData.template = template;
            }
            if (req.body.hasOwnProperty("username") && username !== user.username) {
                updateData.username = username;
            }
            if (req.body.hasOwnProperty("title") && title !== user.title) {
                updateData.title = title;
            }
            if (req.body.hasOwnProperty("country") && country !== user.country) {
                updateData.country = country;
            }
            if (req.body.hasOwnProperty("bio") && bio !== user.bio) {
                updateData.bio = bio;
            }
            if (req.body.hasOwnProperty("image") && image !== user.image) {
                updateData.image = image;
            }
            if (req.body.hasOwnProperty("website") && website !== user.website) {
                updateData.website = website;
            }
            if (req.body.hasOwnProperty("linkedIn") && linkedIn !== user.linkedIn) {
                updateData.linkedIn = linkedIn;
            }
            if (req.body.hasOwnProperty("github") && github !== user.github) {
                updateData.github = github;
            }
            if (req.body.hasOwnProperty("private") && privateField !== user.private) {
                updateData.private = privateField;
            }

            updateData.updatedAt = new Date();

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