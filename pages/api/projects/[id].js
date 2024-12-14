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

            const projectsById = await prisma.project.findMany({
                where: {
                    userId: session.user.id
                }
            })
            res.status(200).json(projectsById);
        } catch (error) {
            console.error(`Error fetching projects:`, error);
            res.status(500).json({ error: "Error fetching projects" });
        }
    } else if(req.method === "PUT"){
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

            const { title, startDate, endDate, company, description, link } = req.body;

            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
            });

            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }

            if (session.user.id !== project.userId) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const updatedProject = await prisma.project.update({
                where: { id: parseInt(id) },
                data: {
                    title,
                    startDate,
                    endDate,
                    company,
                    description,
                    link,
                },
            });

            res.status(200).json(updatedProject);
        } catch (error) {
            console.error("Error updating project:", error);
            res.status(500).json({ error: "Error updating project" });
        }
    } else if(req.method === "DELETE"){
        const { id } = req.query;
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

            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
            });

            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }

            if (session.user.id !== project.userId) {
                return res.status(403).json({ error: "Forbidden" });
            }

            await prisma.project.delete({
                where: { id: parseInt(id) },
            });

            res.status(204).json({ message: "Project deleted successfully" });
        } catch (error) {
            console.error("Error deleting project:", error);
            res.status(500).json({ error: "Error deleting project" });
        }
    } else{
        res.status(405).json({ error: "Method not allowed" });
    }
}