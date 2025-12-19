// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const { GoogleGenAI } = require("@google/genai");
// const saveResumes = require("../db/resume");
// const pdf = require("pdf-parse")

// require("dotenv").config();

// async function upload(req, res) {

//   if (!req.files || !req.files.file) {

//     return res.status(400).send({ success: false, message: "No file uploaded" });
//   }

//   try {

//     const jobDescription = req.body.jobDescription;

//     if (!jobDescription) {

//       return res.status(400).send({
//         success: false,
//         message: "Job description is required"
//       });
//     }

//     const data = new Uint8Array(req.files.file.data);
//     const pdf = await pdfjsLib.getDocument({ data }).promise;

//     let text = "";
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       text += content.items.map(i => i.str).join(" ") + "\n\n";
//     }

//     // 2️⃣ Send extracted text to Gemini API
//     if (!process.env.GEMINI_API_KEY) {
//       return res.status(500).send({ success: false, message: "GEMINI_API_KEY not set in env" });
//     }

//     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//     const prompt = `
//       You are a specialized AI resume analyst and ATS optimization expert.

//       Your task is to analyze the RESUME text and, if a JOB DESCRIPTION is provided, evaluate how well the resume matches the role from both a recruiter and ATS perspective.

// STRICT INSTRUCTIONS:
//     - Return ONLY valid JSON
//       - Do NOT include markdown, explanations, or extra text
//         - All numeric scores must be integers between 0 and 100
//           - Suggestions must be practical, specific, and actionable
//             - Recommended skills must be relevant to the job description
//               - Improved resume text must be fully optimized, professional, and ATS - friendly

// Return JSON strictly in the following structure:

//     {
//       "resumeScore": number,
//         "atsScore": number,
//           "matchPercentage": number,

//             "missingSkills": [],
//               "recommendedSkillsToAdd": [],

//                 "suggestions": [],

//                   "improvedResumeText": "Provide a complete, polished, ATS-optimized resume rewritten from scratch and tailored specifically to the job description. Improve structure, keywords, clarity, impact, and formatting while keeping all information truthful."
//     }

// JOB DESCRIPTION:
// ${jobDescription}

// RESUME TEXT:
// ${text}
//     `;

//     const result = await ai.models.generateContent({

//       model: "gemini-2.5-flash",
//       contents: [{ text: prompt }]
//     });

//     const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No AI response";

//     // 3️⃣ Send AI response to client
//     res.send({
//       success: true,
//       aiAnalysis: aiText
//     });


//   } catch (err) {

//     // Check if the error is quota / limit exceeded
//     if (err?.status === "RESOURCE_EXHAUSTED" || err?.code === 429) {
//       return res.status(429).send({
//         success: false,
//         message: "Your API quota for Gemini AI has been exhausted. Please wait for quota reset or upgrade your plan.",
//         retryAfter: err?.details?.[2]?.retryDelay || "unknown" // optional: shows suggested retry time
//       });
//     }

//     // Generic server error
//     console.error(err);
//     res.status(500).send({
//       success: false,
//       message: "Server error while processing your request",
//       details: err.message
//     });
//   }
// }


// async function saveResume(req, res) {

//   try {

//     const { resumeText } = req.body;

//     let response = await new saveResumes({ resumeText }).save();
//     console.log(response);


//     return res.send({

//       response,
//       status: 200,
//       message: "Your Resume data save successfuly...",

//     })


//   } catch (err) {

//     console.error(err);
//     res.status(500).send({ success: false, message: "Rsume not found", details: err.message });
//   }
// };

// async function getResumeData(req, res) {

//   try {

//     const email = req.user.email;

//     let getDataRes = await saveResumes.find();
//     console.log(getDataRes);


//     return res.send({

//       getDataRes,
//       status: 200,
//       message: "Your Resume data save successfuly...",

//     })


//   } catch (err) {

//     console.error(err);
//     res.status(500).send({ success: false, message: "Rsume not found", details: err.message });
//   }
// };

// module.exports = { upload, saveResume, getResumeData }


const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const { GoogleGenAI } = require("@google/genai");
const saveResumes = require("../db/resume");
require("dotenv").config();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit serverless ke liye

async function upload(req, res) {
  if (!req.files || !req.files.file) {
    return res
      .status(400)
      .send({ success: false, message: "No file uploaded" });
  }

  const file = req.files.file;

  // Heavy PDF se timeout/memory issue avoid
  if (file.size > MAX_FILE_SIZE) {
    return res.status(413).send({
      success: false,
      message: "File too large. Please upload a PDF smaller than 5MB."
    });
  }

  try {
    const jobDescription = req.body.jobDescription;

    if (!jobDescription) {
      return res.status(400).send({
        success: false,
        message: "Job description is required"
      });
    }

    const data = new Uint8Array(file.data);
    const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

    let text = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(" ") + "\n\n";

      // Optional: bahut lambi CVs se bachne ke liye
      if (i >= 10) break;
    }

    // Gemini key check
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).send({
        success: false,
        message: "GEMINI_API_KEY not set in env"
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are a specialized AI resume analyst and ATS optimization expert.

Your task is to analyze the RESUME text and, if a JOB DESCRIPTION is provided, evaluate how well the resume matches the role from both a recruiter and ATS perspective.

STRICT INSTRUCTIONS:
- Return ONLY valid JSON
- Do NOT include markdown, explanations, or extra text
- All numeric scores must be integers between 0 and 100
- Suggestions must be practical, specific, and actionable
- Recommended skills must be relevant to the job description
- Improved resume text must be fully optimized, professional, and ATS-friendly

Return JSON strictly in the following structure:

{
  "resumeScore": number,
  "atsScore": number,
  "matchPercentage": number,
  "missingSkills": [],
  "recommendedSkillsToAdd": [],
  "suggestions": [],
  "improvedResumeText": "Provide a complete, polished, ATS-optimized resume rewritten from scratch and tailored specifically to the job description. Improve structure, keywords, clarity, impact, and formatting while keeping all information truthful."
}

JOB DESCRIPTION:
${jobDescription}

RESUME TEXT:
${text}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }]
    });

    const aiText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No AI response";

    return res.send({
      success: true,
      aiAnalysis: aiText
    });
  } catch (err) {
    // Quota / limit exceeded
    if (err?.status === "RESOURCE_EXHAUSTED" || err?.code === 429) {
      return res.status(429).send({
        success: false,
        message:
          "Your API quota for Gemini AI has been exhausted. Please wait for quota reset or upgrade your plan.",
        retryAfter: err?.details?.[2]?.retryDelay || "unknown"
      });
    }

    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Server error while processing your request",
      details: err.message
    });
  }
}

async function saveResume(req, res) {
  try {
    const { resumeText } = req.body;

    const response = await new saveResumes({ resumeText }).save();
    console.log(response);

    return res.send({
      response,
      status: 200,
      message: "Your Resume data saved successfully..."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Resume not found",
      details: err.message
    });
  }
}

async function getResumeData(req, res) {
  try {
    const email = req.user.email; // agar future me filter lagana ho to yeh use hoga

    const getDataRes = await saveResumes.find();
    console.log(getDataRes);

    return res.send({
      getDataRes,
      status: 200,
      message: "Your Resume data fetched successfully..."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Resume not found",
      details: err.message
    });
  }
}

module.exports = { upload, saveResume, getResumeData };
