'use server';

import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react";

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


        const { title, startDate, endDate, company, description, link } = req.body;

        if (!title && !startDate) {
            return res.status(400).json({ error: "Title or date must be inserted" });
        }

        try {

            const newProject = await prisma.project.create({
                data: {
                    userId: session.user.id,
                    title, 
                    startDate,
                    endDate,
                    company,
                    description,
                    link,
                }
            });

            res.status(201).json(newProject);
        } catch (error) {
            console.error(`Error creating project:`, error);
            res.status(500).json({ error: "Error creating project" })
        }
    } else if (req.method === "GET") {
        try {
            const projects = await prisma.project.findMany();
            res.status(200).json(projects);
        } catch (error) {
            console.error(`Error fetching projects:`, error);
            res.status(500).json({ error: "Error fetching projects" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}