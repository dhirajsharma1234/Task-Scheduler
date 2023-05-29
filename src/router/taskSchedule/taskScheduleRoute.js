import { project } from "../../controllers/taskSchedule/project.js";
import { authUser } from "../../auth/auth.js";
import express from "express";
const router = new express.Router();

//Adding Project
router.route("/")
.post(authUser,project.addProject)
.get(authUser,project.getProjects);

router.route("/:id")
.patch(authUser,project.updateProject)
.delete(authUser,project.deleteProject)
.get(authUser,project.getProjectById);

export default router;