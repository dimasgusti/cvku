'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            const filters = {};

            if (userId) {
                filters.userId = userId;  
            }

            const records = await prisma.record.findMany({
                where: filters,
            });

            res.status(200).json(records);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching records." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}