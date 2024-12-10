import clientPromise from '../../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session?.user?.email) {
            return res.status(401).json({ error: "Unauthorized, missing email" });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: session.user.email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { fullName, title, country, website, github, linkedin, twitterx } = req.body;

        if (!fullName || !title) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const portfolioCollection = db.collection('portfolios');
        const portfolio = await portfolioCollection.insertOne({
            userId: user._id,
            fullName,
            title,
            country,
            socialLinks: { github, linkedin, twitterx, website },
        });

        return res.status(201).json({ message: "Portfolio created", portfolio });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}