// import dotenv from "dotenv";
// import express from "express";
// import fileUpload from "express-fileupload";
// import cors from "cors";

// import dbCon from "../db/db.connection.js";
// import router from "../Router/route.js";
// import routeTwo from "../Router/routeTwo.js";
// import routeJob from "../Router/routeJob.js";

// dotenv.config();

// const app = express();

// app.use(cors({ credentials: true, origin: true }));
// app.use(fileUpload());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// dbCon();

// app.use("/api", router);
// app.use("/api", routeTwo);
// app.use("/api", routeJob);

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// export default app;


// import express from "express";
// import cors from "cors";
// import fileUpload from "express-fileupload";
// import dotenv from "dotenv";

// import dbCon from "../db/db.connection.js";
// import router from "../Router/route.js";
// import routeTwo from "../Router/routeTwo.js";
// import routeJob from "../Router/routeJob.js";
// import dbCon from "../db/db.connection.js";

// await dbCon();


// // dotenv.config();

// const app = express();

// app.use(cors({ origin: true, credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // OPTIONAL — comment this for now if issues persist
// // app.use(fileUpload());

// dbCon();

// app.use("/api", router);
// app.use("/api", routeTwo);
// app.use("/api", routeJob);

// app.get("/api", (req, res) => {
//   res.send("Backend running on Vercel 🚀");
// });

// export default app;


// const express = require("express");
// const serverless = require("serverless-http");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");

// const dbCon = require("./db/db.connection");
// const router = require("./Router/route");
// const routeTwo = require("./Router/routeTwo");
// const routeJob = require("./Router/routeJob");

// // const dbCon = require("../db/db.connection");  // ../db, na ke ./db
// const dbCon = require("../db/db.connection");
// const router = require("../Router/route");
// const routeTwo = require("../Router/routeTwo");
// const routeJob = require("../Router/routeJob");


// const app = express();

// app.use(cors({ credentials: true }));
// app.use(fileUpload());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // dbCon();
// // file ke top par hi call
// dbCon()
//   .then(() => console.log("DB ready"))
//   .catch((err) => console.error("DB error", err));


// app.use("/api", router);
// app.use("/api", routeTwo);
// app.use("/api", routeJob);

// app.get("/api", (req, res) => {
//   res.json({ status: "Backend running 🚀" });
// });

// // ✅ THIS IS REQUIRED
// module.exports = serverless(app);



// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const dbCon = require("../db/db.connection");
const router = require("../Router/route");
const routeTwo = require("../Router/routeTwo");
const routeJob = require("../Router/routeJob");

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection: ek hi dafa app start par, har request par nahi
let dbReady = dbCon()
  .then(() => {
    console.log("DB ready");
  })
  .catch((err) => {
    console.error("DB error", err);
  });

// agar DB ready na ho to request ko block na kare, bas error de do
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api", router);
app.use("/api", routeTwo);
app.use("/api", routeJob);

app.get("/api", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// ❌ yahan kahin bhi app.listen(...) NA likhna
// ✅ sirf handler export karo
module.exports = serverless(app);
