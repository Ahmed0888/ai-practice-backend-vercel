// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// // console.log(process.env.DB);

// async function dbCon() {

//     try {

//         const db = await mongoose.connect(process.env.DB)
//             .then(() => console.log("Database Connected"))
//             .catch((err) => console.log(`Connection Faild ${err}`))

//         mongoose.connection.on('connected', () =>
//             console.log('DATABASE SUCCESSFULLY CONNECTED...!')
//         );

//         mongoose.connection.on('disconnected', () =>
//             console.log('DATABASE CONNECTION TERMINATED...!')
//         );

//     }
//     catch (err) {
//         console.log(err, "here in an error");
//     }
// }


// module.exports = dbCon;

// db/db.connection.js
// const mongoose = require("mongoose");

// let isConnected = false;

// const dbCon = async () => {
//   if (isConnected) return;

//   if (!process.env.DB) {           // 👈 yahan tumhari actual env key use karo
//     throw new Error("DB is not defined");
//   }

//   try {
//     await mongoose.connect(process.env.DB);
//     isConnected = true;
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     throw error;
//   }
// };

// module.exports = dbCon;



// db/db.connection.js
const mongoose = require("mongoose");

let isConnected = false;

const dbCon = async () => {
  if (isConnected) return;

  if (!process.env.DB) {
    throw new Error("DB is not defined");
  }

  try {
    await mongoose.connect(process.env.DB);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = dbCon;
