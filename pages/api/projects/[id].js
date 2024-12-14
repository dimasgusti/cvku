import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {

            const project = await prisma.project.findUnique({
                where: { id: parseInt(id) },
            });

            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }

            if (session.user.id !== project.userId) {
                return res.status(403).json({ error: "Forbidden" });
            }

            res.status(200).json(project);
        } catch (error) {
            console.error(`Error fetching project:`, error);
            res.status(500).json({ error: "Error fetching project" });
        }
    }

    else if (req.method === "PUT") {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
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
                }
            });

            res.status(200).json(updatedProject);
        } catch (error) {
            console.error(`Error updating project:`, error);
            res.status(500).json({ error: "Error updating project" });
        }
    }

    else if (req.method === "DELETE") {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
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
            console.error(`Error deleting project:`, error);
            res.status(500).json({ error: "Error deleting project" });
        }
    }

    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}