const express = require("express");
const { companyDetails, companiesData } = require("../Controller/companyDetails");

const router = express.Router();

router.post("/company", companyDetails);
router.get("/companiesData", companiesData);


module.exports = router