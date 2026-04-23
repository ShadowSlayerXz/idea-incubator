const mongoose = require('mongoose');

const connectDB = async () => {
  const isAtlas = process.env.MONGO_URI?.includes('mongodb+srv');
  const options = {
    serverSelectionTimeoutMS: 10000,
    ...(isAtlas && {
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      family: 4,
    }),
  };
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
