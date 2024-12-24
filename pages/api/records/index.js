'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res){
    if(req.method === "POST"){
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

        const { type, title, year, issued, expires, from, to, company, organization, location, presentedBy, url, description } = req.body;

        if(!type || !title){
            return res.status(400).json({ error: "Type must be inserted." })
        }

        try {
            const newRecords = await prisma.record.create({
                data: {
                    userId: session.user.id,
                    type,
                    title,
                    year, 
                    issued,
                    expires,
                    from,
                    to,
                    company,
                    organization, 
                    location,
                    presentedBy,
                    url,
                    description,
                }
            });

            res.status(201).json(newRecords);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error updating new records." });
        }
    } else if(req.method === "GET"){
        try {
            const records = await prisma.record.findMany();
            res.status(200).json(records);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error fetching records." });
        }
    } else{
        res.status(405).json({ error: "Sorry, method not allowed." });
    }
}