import mongoose from 'mongoose';
import {logger} from "../middlewere/logger.js";

class DbConnection {
    async connectToDatabase() {
        try {
            const mongodbUri = process.env.MONGODB_URI;
            await mongoose.connect(mongodbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            logger.info('Connected to the database');
        } catch (error) {
            logger.error('Error connecting to the database:', error);
            setTimeout(this.connectToDatabase, 5000);
        }
    }
}

export default DbConnection;

