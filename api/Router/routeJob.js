const express = require("express");
const { jobData, jobDataPost } = require("../Controller/jobFinder");
const authrization = require("../Middleware/authentication");


const router = express.Router();

router.post("/jobData", jobData);
router.get("/jobDataPost", jobDataPost);


module.exports = router