// models/notificationLog.js
import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
    taskId: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('NotificationLog', notificationLogSchema);
