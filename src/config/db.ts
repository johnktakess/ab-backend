import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGO_URI; //|| 'mongodb://127.0.0.1:27017/oauth2_demo'


/* const connectDB = async () => {
await mongoose.connect(MONGO_URI);
}; */
const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in .env file");
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
};

export default connectDB;