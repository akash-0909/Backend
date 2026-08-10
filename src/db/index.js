import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.error("Error connecting to MongoDB:", err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log("Server is running on port", process.env.PORT);
//     });
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// })();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Connected to MongoDB database: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
   process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;