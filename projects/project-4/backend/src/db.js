import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(`✔️  MongoDB connection is successful`))
    .catch((err) => console.log(`❌ MongoDB connection is failed\n${err}`));
};
