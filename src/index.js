import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
    path: "./.env"
});
connectDB()
    .then(() => {
        app.listen(
            process.env.PORT || 8000,
            "0.0.0.0",
            () => {
                console.log(
                    `Server is running on port ${process.env.PORT || 8000}`
                );
            }
        );
    })
    .catch((err) => {
        console.log("Error occurred while connecting to MongoDB", err);
    }
    ); 