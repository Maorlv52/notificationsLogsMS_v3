import mongoose from "mongoose";

const NotificationLogsSchema = mongoose.Schema;

const notificationLogsCollection = new NotificationLogsSchema({
    taskId: mongoose.Schema.Types.String,
    deadline: mongoose.Schema.Types.Number,
    notified: mongoose.Schema.Types.Boolean
}, { timestamps : true });

const notificationsLogsCollection = mongoose.model('notificationLogs', notificationLogsCollection, "notificationLogs");

export default notificationsLogsCollection
