import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {

    if (req.method === "POST") {
        const {
            email,
            type, 
            title,
            year,
            from,
            fromMonth,
            to,
            toMonth,
            issued,
            expires,
            company,
            organization,
            presentedBy,
            institution,
            description,
            fieldOfStudy,
            gpa,
            url,
            images
        } = req.body;

        if (!email || !type || !title) {
            return res.status(400).json({ error: "Email, type, and title are required." });
        }

        try {
            const client = await clientPromise;
            const collection = client.db().collection("users");

            const imageUrls = Array.isArray(images) ? images : [];

            const newItem = {
                _id: new ObjectId(),
                title,
                year,
                from,
                fromMonth,
                to,
                toMonth,
                issued,
                expires,
                company,
                organization,
                institution,
                presentedBy,
                fieldOfStudy,
                gpa,
                description,
                url,
                images: imageUrls,
            };

            const updateResult = await collection.updateOne(
                { email },
                {
                    $addToSet: {
                        [type]: newItem, 
                    },
                    $set: { updatedAt: new Date() },
                }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ error: "User not found or no changes made" });
            }

            return res.status(201).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully` });
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
            return res.status(500).json({ error: `An error occurred while adding the ${type}` });
        }
    }
}