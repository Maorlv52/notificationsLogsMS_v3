import express from 'express';
import DbConnection from './db/dbConnection.js';

// import NotificationLog from './models/notificationLog.js';

const app = express();

// import mongoose from 'mongoose';
// import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const db = new DbConnection();
await db.connectToDatabase();
// import Task from './schemas/tasks.schema.js';
import router from "./routes/notificationsLogs.route.js";
import {logger, loggerMiddleware} from './middlewere/logger.js'
import cronJob from "./notifications/notificationsCron.js";



app.use(express.json());
app.use(loggerMiddleware);
cronJob.start()

app.use('/', router)


// Define a scheduled task
// cron.schedule('* * * * *', async () => {
//     try {
//         // Connect to the database
//         await mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
//
//         // Find tasks where the deadline has passed
//         const currentDate = new Date();
//         const tasks = await Task.find({ deadline: { $lt: currentDate } });
//
//         // Handle tasks where the deadline has passed
//         for (const task of tasks) {
//             // Implement your logic here
//             // For example, you might update the task status
//             task.status = 'deadline_passed';
//             await task.save(); // Save the updated task
//         }
//
//         // Close the database connection
//         await mongoose.connection.close();
//     } catch (error) {
//         console.error(error);
//     }
// });

// Start the Express app
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
