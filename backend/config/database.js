import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const maxRetries = 3;
  let attempt = 0;

  // Check if URI is default/placeholder
  const isPlaceholder = !uri || uri.includes('username:password');

  if (isPlaceholder) {
    console.log('⚠️ Placeholder MONGODB_URI detected. Attempting MongoMemoryServer fallback for local execution...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ In-Memory MongoDB Server connected at ${memUri}`);
      return;
    } catch (memErr) {
      console.error('Failed to launch In-Memory MongoDB Server:', memErr.message);
    }
  }

  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`Connecting to MongoDB Atlas (Attempt ${attempt}/${maxRetries})...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`❌ Connection Attempt ${attempt} failed: ${err.message}`);
      if (attempt >= maxRetries) {
        console.log('⚠️ Atlas connection failed. Starting In-Memory Mongo fallback for instant local demo...');
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          await mongoose.connect(memUri);
          console.log(`✅ Fallback In-Memory MongoDB Server connected at ${memUri}`);
          return;
        } catch (memErr) {
          console.error('CRITICAL: MongoDB connection completely failed.', memErr);
          process.exit(1);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
