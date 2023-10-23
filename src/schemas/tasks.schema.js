import mongoose from "mongoose";

const TaskSchema = mongoose.Schema;

const TasksCollection = new TaskSchema({
    uId: mongoose.Schema.Types.String,
    userDetails: {
        userName: mongoose.Schema.Types.String,
        userEmail: mongoose.Schema.Types.String
    },
    taskName: mongoose.Schema.Types.String,
    cDate: mongoose.Schema.Types.String,
    deadline: mongoose.Schema.Types.String,
    status: {
        type: mongoose.Schema.Types.String,
        enum: ['TO-DO', 'IN-PROGRESS', 'COMPLETED'] // todo read about enums in JS
    }
}, { timestamps : true });

const tasksCollection = mongoose.model('Tasks', TasksCollection, "Tasks");

export default tasksCollection
