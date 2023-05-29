import Task  from "../../model/task.js";
import Project from "../../model/taskSchedule.js";
import { status } from "../../config/status.js";
import { message } from "../../config/message.js";

class ProjectTask {
    createTask = async(req,res) =>{
        try {
            const { taskName,taskDescription,dueDate,taskStatus } = req.body;
            const userId = req.user._id;
            const { projectId } = req.params;

            if(!taskName || !taskDescription || !dueDate || !taskStatus) {
                return res.status(406).json({status:status.NOT_ACCEPTABLE,message:message.EMPTY_FIELD});
            }
            
            //get project data
            const project = await Project.findOne({_id:projectId});

            if(!project) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            await Task.create({
                userId,
                projectId,
                taskName,
                taskDescription,
                dueDate,
                status:taskStatus
            });

            return res.status(200).json({status:status.SUCCESS,message:message.TASK_CREATE});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:message.BAD_REQUEST});
        }
    }

    //get all task corresponding to project id
    getAllTask = async(req,res) =>{
        try {
            const { projectId } = req.params;
            const { _id } = req.user;

            const getAllTask = await Task.find({ projectId,userId:_id });

            return res.status(200).json({status:status.SUCCESS,data:getAllTask});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:message.BAD_REQUEST});
        }
    }

    editTask = async(req,res) =>{
        try {
            const { projectId,taskId } = req.params;
            const { _id } = req.user;
            const { taskName,taskDescription,dueDate,taskStatus } = req.body;

            const project = await Project.findOne({ _id:projectId,userId:_id });

            console.log(project);
            if(!project) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            const updateTask = await Task.findOneAndUpdate(
                { _id:taskId,projectId,userId:_id },
                {
                    $set:{
                        taskName,
                        taskDescription,
                        dueDate,
                        status:taskStatus
                    }
                },
                {
                    new:true
                }
            );

            if(!updateTask) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            return res.status(200).json({status:status.SUCCESS,message:message.TASK_UPDATE});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:message.BAD_REQUEST});
        }
    }

    deleteTask = async(req,res) =>{
        try {
            const { projectId,taskId } = req.params;
            const { _id } = req.user;

            const project = await Project.findOne({ _id:projectId,userId:_id});

            if(!project) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            const deleteTask = await Task.findOneAndDelete(
                { _id:taskId,projectId,userId:_id },
            );

            if(!deleteTask) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }

            return res.status(200).json({status:status.SUCCESS,message:message.TASK_DELETE});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:message.BAD_REQUEST});
        }
    }
}

const taskObj = new ProjectTask();
export { taskObj };
