import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `MongoDB connected: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MONGODB ERROR:", error.message);

        if (error.reason?.servers) {
            for (const [host, server] of error.reason.servers) {
                console.log(
                    "SERVER:",
                    host,
                    "ERROR:",
                    server.error?.message
                );
            }
        }

        process.exit(1);
    }
};

export default connectDB;