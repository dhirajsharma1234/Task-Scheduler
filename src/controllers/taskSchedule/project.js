import Project from "../../model/taskSchedule.js";
import { status } from "../../config/status.js";
import { message } from "../../config/message.js";


class MyProject {
    addProject = async(req,res) =>{
        try {
            const userId = req.user._id;
  
            const { projectName,projectDescription,dueDate } = req.body;

            await Project.create({
                userId,
                projectName,
                projectDescription,
                dueDate
            });


            return res.status(201).json({status:status.CREATED,message:message.PROJECT_CREATE});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    //GET ALL PROJECTS
    getProjects = async(req,res) =>{
        try {
            const userId = req.user._id;

            const getAllProject = await Project.find({ userId });

            return res.status(200).json({status:status.SUCCESS,data:getAllProject});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    getProjectById = async(req,res) =>{
        try {
            const userId = req.user._id;
            const { id }= req.params;

            const getProject = await Project.findOne({ _id:id,userId });

            return res.status(200).json({status:status.SUCCESS,data:getProject});
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    //edit project
    updateProject = async(req,res) =>{
        try {
            const {_id} = req.user;
            const { id } = req.params;
            const { projectName,projectDescription,dueDate } = req.body;

            const project = await Project.findOne(
                { _id:id,userId:_id },
            );

            if(!project) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }
            
            const updateProject = await Project.findOneAndUpdate(
                { _id:id,userId:_id },
                { projectName,projectDescription,dueDate },
                { new:true }
            );

            return res.status(200).json({status:status.SUCCESS, message:message.PROJECT_UPDATE});

        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }

    //delete project
    deleteProject = async(req,res) =>{
        try {
             const {_id} = req.user;
             const { id } = req.params;

             const project = await Project.findOne(
                { _id:id,userId:_id },
            );

            if(!project) {
                return res.status(404).json({status:status.NOT_FOUND,message:message.NOT_FOUND});
            }
            
            const updateProject = await Project.findOneAndDelete(
                { _id:id,userId:_id },
            );

            return res.status(200).json({status:status.SUCCESS, message:message.PROJECT_DELETE})
        } catch (error) {
            return res.status(400).json({status:status.BAD_REQUEST,message:error.message});
        }
    }
}

const project = new MyProject();
export { project };
