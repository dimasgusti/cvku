'use server';

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
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

        const { 
            type, title, year, issued, expires, from, fromMonth, to, toMonth, company, organization, institution, fieldOfStudy, gpa, location, 
            presentedBy, url, description, images
        } = req.body;

        if (!type || !title) {
            return res.status(400).json({ error: "Type and title are required." });
        }

        try {
            let imageUrls = [];
            if (images && images.length > 0) {
                imageUrls = images; 
            }

            const newRecord = await prisma.record.create({
                data: {
                    userId: session.user.id,
                    type,
                    title,
                    year, 
                    issued,
                    expires,
                    from,
                    fromMonth: fromMonth,
                    to,
                    toMonth,
                    company,
                    organization, 
                    institution,
                    fieldOfStudy, 
                    gpa,
                    location,
                    presentedBy,
                    url,
                    description,
                    image: imageUrls, 
                }
            });

            res.status(201).json(newRecord);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating the record." });
        }
    } else if (req.method === "GET") {
        try {
            const records = await prisma.record.findMany();
            res.status(200).json(records);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching records." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}