import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    projectName:{
        type:String,
        required:true
    },
    projectDescription:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date
    }
},
{
    timestamps:true
});

const TaskModel = new mongoose.model("task-schedule",taskSchema);

export default TaskModel;