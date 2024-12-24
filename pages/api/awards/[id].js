'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res){
    if(req.method === "GET"){
        try {
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

            const awardsById = await prisma.award.findMany({
                where: {
                    userId: session.user.id,
                }
            })
            res.status(200).json(awardsById);
        } catch (error) {
            res.status(500).json({ error: "Error fetching records." });
        }
    }
}