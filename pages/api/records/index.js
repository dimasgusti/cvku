'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const response = await fetch("http://localhost:3000/api/auth/session", {
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

        const { type, title, year, company, url, description, presentedBy } = req.body;

        if (!type || !title || !year) {
            return res.status(400).json({ error: "Type, title, and year must be provided." });
        }

        try {
            let newRecord;

            if (type === "project") {
                newRecord = await prisma.project.create({
                    data: {
                        userId: session.user.id,
                        type,
                        title,
                        year,
                        company,
                        url,
                        description,
                    },
                });
            }
            else if (type === "award") {
                newRecord = await prisma.award.create({
                    data: {
                        userId: session.user.id,
                        type,
                        title,
                        year,
                        presentedBy,
                        url,
                        description,
                    },
                });
            } else {
                return res.status(400).json({ error: "Invalid type. Must be 'project' or 'award'." });
            }

            res.status(201).json(newRecord);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating new record." });
        }
    } else if (req.method === "GET") {
        try {
            const projects = await prisma.project.findMany();
            const awards = await prisma.award.findMany();

            res.status(200).json({ projects, awards });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching records." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}