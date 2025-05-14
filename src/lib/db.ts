import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb Connected Successfully ${conn.connection.host}`)
    } catch (error) {
        console.log(`Something went wrong while connecting DB ${error}`)
    }
}