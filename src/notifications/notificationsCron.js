import cron from 'node-cron';
import notificationLog from '../schemas/notificationLogs.schema.js'
import NotificationsLogsActions from '../controllers/notificationsLogs.controller.js'
import {logger} from "../middlewere/logger.js";

const Notify = new NotificationsLogsActions(null, null)

// Define the cron schedule (every minute)
const cronJob = cron.schedule('* * * * *', async () => {
    try {
        const formattedToday = Notify.getTodayAsInteger()
        const logs = await notificationLog.find({$and: [{ deadline: { $lte: formattedToday } }, { notified: false }]}, { deadline: 1, notified: 1, _id: 1 });

        for (const log of logs) {
            const deadline = log.deadline; //todo add indexes to deadline and notified

            if (deadline <= formattedToday) {
                const updateNotify = await notificationLog.updateOne({ _id: log._id }, { $set: { notified: true } });
                await Notify.notifyUser(updateNotify)
            }
        }

        logger.info('Cron job completed successfully.');
    } catch (error) {
        logger.info('Error in cron job:', error);
    }
});

export default cronJob;
