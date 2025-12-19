// import dotenv from "dotenv";
// const express = require("express");
// const fileUpload = require("express-fileupload");
// const dbCon = require("./db/db.connection");
// const router = require("./Router/route");
// const routeTwo = require("./Router/routeTwo");
// const routeJob = require("./Router/routeJob");

// const cors = require("cors")


// const app = express()
// const PORT = 3000 || process.env.PORT;

// dotenv.config();
// app.use(cors({credentials: true}))
// app.use(fileUpload());
// app.use(express.json());
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));


// dbCon();



// app.use("/api", router)
// app.use("/api", routeTwo)
// app.use("/api", routeJob)


// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// })


// // app.listen(PORT, () => {
// //     console.log(`Server is working successfuly on ${PORT}`);
// // })

// module.exports = app;