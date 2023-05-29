import userRoute from "./user/userRoute.js";
import projectRoute from "./taskSchedule/taskScheduleRoute.js";
import taskRoute from "./taskSchedule/task.js";
import express from "express";
const router = new express.Router();

//user route
router.use("/api/user",userRoute);

//adding project route
router.use("/api/project",projectRoute)
router.use("/api/task",taskRoute);

export default router;