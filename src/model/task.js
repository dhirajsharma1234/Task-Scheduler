import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    projectId:{
        type:mongoose.Types.ObjectId,
        ref:"task-schedule"
    },
    taskName:{
        type:String,
        required:true
    },
    taskDescription:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["INPROGRESS","COMPLETED","PENDING"]
    }
})

const Task = new mongoose.model("task",taskSchema);

export default Task;