import express from "express";
const router = new express.Router();
import { authUser } from "../../auth/auth.js";
import {taskObj} from "../../controllers/taskSchedule/task.js";


router.route("/:projectId")
.post(authUser,taskObj.createTask)
.get(authUser,taskObj.getAllTask);

router.route("/:projectId/:taskId")
.patch(authUser,taskObj.editTask)
.delete(authUser,taskObj.deleteTask);


export default router;