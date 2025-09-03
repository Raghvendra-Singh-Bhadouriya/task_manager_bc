import express from "express";
import projectModel from "../Models/projectSchema.js"
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// ================= Post Method to Upload Projects ================== //
router.post("/add_project", async (req, res) => {
    try {
        const {title} = req.body;

        if(!title){
            return res.status(400).json({message: `title is required`})
        }

        const newProject = new projectModel(req.body)
        newProject.save()
        res.status(201).json({
            message: `Project added successfully`,
            data: newProject
        })
    } catch (error) {
        res.status(500).json({message: `Project not added: ${error.message}`})
    }
})

// ================= Get Method to Fetched all Projects ================== //
router.get("/all-projects", async (req, res) => {
    try {
        const projects = await projectModel.find().sort({createdAt: -1})  //decending = -1, acending = +1

        //const sortedProjects = projects.sort((a, b) => b.createdAt - a.createdAt)
        res.status(200).json({
            message: `Projects Fetched Successfully`,
            data: projects
        })
    } catch (error) {
        res.status(500).json({message: `Projects not fetched: ${error.message}`})
    }
})

// ================= Patch Method to Update Project by id ================== //
router.put("/update_project/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const findProject = await projectModel.findById(id)
        if(!findProject){
            return res.status(404).json({
                message: `Project not found`
            })
        }

        const updatedProject = await projectModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        console.log(updatedProject)

        res.status(200).json({
            message: `project updated successfully`,
            data: updatedProject
        })
    } catch (error) {
        res.status(500).json({message: `Internal server error: ${error.message}`})
    }
})

// ================= Delete Method to Delete Project by id ================== //
router.delete("/delete_project/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const findProject = await projectModel.findById(id)
        if(!findProject){
            return res.status(404).json({
                message: `Project not found`
            })
        }

        const deletedProject = await projectModel.findByIdAndDelete(id)
        console.log(deletedProject)

        res.status(200).json({
            message: `project deleted successfully`,
            data: deletedProject
        })
    } catch (error) {
        res.status(500).json({message: `Internal server error: ${error.message}`})
    }
})

export default router;