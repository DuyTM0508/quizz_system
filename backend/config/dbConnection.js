const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${connect.connection.name}`
    );
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = dbConnection;
