import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = async (retries = 5, delay = 3000) => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });
      
      return conn;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      
      if (attempt === retries) {
        throw new Error(`Failed to connect to MongoDB after ${retries} attempts: ${error.message}`);
      }
      
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
