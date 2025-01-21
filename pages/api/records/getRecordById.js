'use server';

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res){
    if(req.method === "GET"){
        try {
    
            const session = await response.json();
    
            if (!session || !session.user || !session.user.id) {
                return res.status(401).json({ error: "Unauthorized. Invalid session." });
            }

            const projectsById = await prisma.record.findMany({
                where: {
                    userId: session.user.id,
                }
            })
            res.status(200).json(projectsById);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            res.status(500).json({ error: "Error fetching records.", details: error.message });
        }
    }
}