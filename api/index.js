const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Fix: Absolute paths for Vercel bundling
const dbCon = require("./db/db.connection");
const router = require("./Router/route");
const routeTwo = require("./Router/routeTwo");
const routeJob = require("./Router/routeJob");

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
let dbReady = dbCon()
  .then(() => console.log("DB ready"))
  .catch((err) => console.error("DB error", err));

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

module.exports = serverless(app);
