import mongoose from 'mongoose';
// import dotenv from "dotenv"

// dotenv.config()

export const connectDB = async () => {
  try {
    // console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✓ Database connected successfully');

  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    // process.exit(1);
  }
};

// export const disconnectDB = async () => {
//   try {
//     await mongoose.disconnect();
//     console.log('✓ Database disconnected');
//   } catch (error) {
//     console.error('✗ Database disconnection failed:', error.message);
//     process.exit(1);
//   }
// };
