import express from 'express';
import NotificationsLogsActions from "../controllers/notificationsLogs.controller.js";
import {logger} from "../middlewere/logger.js";
// import {log} from "winston";

const router = express.Router();

// Assuming you have already set up Express
router.post('/process-notification', async (req, res) => {
    try {
        const {deadline, _id, action} = req.body
        const updateCollection = new NotificationsLogsActions(deadline, _id)

        const response = action === "create" ? await updateCollection.createNotificationsLogsCollection() :
            await updateCollection.updateNotificationsLogsCollection()
        // action === "update" && await updateCollection.updateNotificationsLogsCollection()

        logger.info('Notification processed successfully')
        res.json({message:'Notification processed successfully', response});

    } catch (error) {
        logger.info(error.message)
        res.status(400).json({error: error.message})
    }
});


router.delete("/deleteNotificationsLogs", async (req, res) => {
    try {
        const clearCollection = new NotificationsLogsActions(null, null)
        await clearCollection.clearNotificationsLogsCollection()

        logger.info('NotificationLogs collection deleted successfully')
        res.json('NotificationLogs collection deleted successfully');

    } catch (error) {
        logger.error(error.message)
        res.status(400).json({error: error.message})
    }
})

router.get("/getLogsMS", async (req, res) => {
    const collectionLogs = new NotificationsLogsActions()
    const getLogs = await collectionLogs.getAllLogs()
    console.log(getLogs)
    res.json({result: getLogs})

})

export default router;