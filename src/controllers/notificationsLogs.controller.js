import notificationLog from '../schemas/notificationLogs.schema.js'
import {logger} from "../middlewere/logger.js";

// import mongoose from "mongoose";


class NotificationsLogsActions {
    constructor(deadline, _id) {
        this.deadline = deadline || null,
            this._id = _id || null
    }

    getTodayAsInteger() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedToday = Number(`${year}${month}${day}`);
        return formattedToday
    }

    async createNotificationsLogsCollection() {
        const fixedDeadLine = parseInt(this.deadline.split('/').reverse().join().replaceAll(",", ""))
        const createNotificationsLogsCollection = await notificationLog.create({
            deadline: fixedDeadLine,
            taskId: this._id,
            notified: false
        })
        if (!createNotificationsLogsCollection) throw new Error("[ERROR-createNotificationsLogsCollection] could not complete action")
        return createNotificationsLogsCollection
    }

    async updateNotificationsLogsCollection() {
        const fixedDeadLine = parseInt(this.deadline.split('/').reverse().join().replaceAll(",", ""))

        // const today = new Date();
        // const year = today.getFullYear().toString().slice(-2);
        // const month = String(today.getMonth() + 1).padStart(2, '0');
        // const day = String(today.getDate()).padStart(2, '0');
        // const formattedToday = Number(`${year}${month}${day}`);
        const formattedToday = this.getTodayAsInteger()
        const updatedNotificationsLogsCollection = fixedDeadLine > formattedToday ? await notificationLog.updateOne({taskId: this._id}, {
            $set:
                {deadline: fixedDeadLine, notified: false}
        }) : await notificationLog.updateOne({taskId: this._id}, {$set: {deadline: fixedDeadLine}});

        if (updatedNotificationsLogsCollection.nModified === 0) throw new Error(`[ERROR-updateNotificationsLogsCollection] No document found for taskId: ${this._id}`);
        return updatedNotificationsLogsCollection;
    }

    async clearNotificationsLogsCollection() {

        const clean = await notificationLog.deleteMany();
        if (!clean.acknowledged) throw new Error("[ERROR-clearNotificationsLogsCollection] could not complete process")
        if (clean.deletedCount === 0) throw new Error("there are no logs in the notificationLogs collection")
    }


    async notifyUser(notification) {
        if (!notification.acknowledged) throw new Error("[ERROR-notifyUser] could not notify user")
        if (notification.acknowledged && notification.modifiedCount === 0) throw new Error("[ERROR-notifyUser] User was not updated")
        logger.info("User notified")
    }

    async getAllLogs () {
        const allLogs = await notificationLog.find({})
        if (!allLogs) throw new Error("[ERROR-getAllLogs] could not complete process")
        return allLogs
    }
}

export default NotificationsLogsActions;