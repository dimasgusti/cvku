import clientPromise from "../../../lib/mongodb";;

export default async function handler(req, res) {
    console.log("Request Method", req.method)
    if(req.method === 'POST') {
        const {
            email, title, year, fromMonth, company, description, url, images
        } = req.body;

        console.log("Request Body:",req.body);

        if(!email || !title) {
            return res.status(400).json({ error: "User ID are required."});
        }

        try {
            const client = await clientPromise;
            const collection = client.db().collection("users");

            const imageUrls = Array.isArray(images) ? images : [];

            const filter = {
                email: email
            }

            const newProject = {
                title,
                year,
                fromMonth,
                company,
                description,
                url,
                images: imageUrls,
            }

            const updateResult = await collection.updateOne(
                filter,
                {
                    $addToSet: {  
                        project: newProject,
                    },
                    $set: { updatedAt: new Date() },
                }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ error: "User not found or no changes made" });
            }

            return res.status(201).json({ message: "Project added successfully" });
        } catch (error) {
            console.error("Error adding project:", error);
            return res.status(500).json({ error: "An error occurred while adding the project" });
        }
    }
}