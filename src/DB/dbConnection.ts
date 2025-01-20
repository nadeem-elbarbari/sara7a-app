import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection failed... ', error);
  }
};

export default connectDB;
