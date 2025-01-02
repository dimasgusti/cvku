'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "DELETE") {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
            headers: {
                cookie: req.headers.cookie || "",
            },
        });

        if (!response.ok) {
            return res.status(401).json({ error: "Unauthorized. Unable to fetch session." });
        }

        const session = await response.json();

        if (!session || !session.user || !session.user.id) {
            return res.status(401).json({ error: "Unauthorized. Invalid session." });
        }

        const { recordId } = req.query;

        if (!recordId && req.body && req.body.recordId) {
            recordId = req.body.recordId;
        }

        if (!recordId) {
            return res.status(400).json({ error: "Record ID must be provided." });
        }

        try {
            const record = await prisma.record.findUnique({
                where: { id: recordId },
            });

            if (!record) {
                return res.status(404).json({ error: "Record not found." });
            }

            if (record.userId !== session.user.id) {
                return res.status(403).json({ error: "Unauthorized. You can only delete your own records." });
            }

            await prisma.record.delete({
                where: { id: recordId },
            });

            res.status(200).json({ message: "Record deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error deleting the record." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}