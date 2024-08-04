const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const Job = require("./models/job");

const mongoURI = "mongodb://127.0.0.1:27017";

const app = express();

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 8080;
//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("status requested for jobid", jobId);
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query params" });
  }

  try {
    const job = await Job.findById({ success: true, jobId });
    if (job === undefined) {
      return res.status(404).json({ success: false, error: "invalid job id" });
    }

    return res.status(200).json(job);
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
  // return res.json({ hello: "world!" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  console.log(language, code);
  console.log(language, code);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  let job;
  try {
    //need to generate C++ file with content from the request
    const filePath = await generateFile(language, code);

    job = await new Job({ language, filePath }).save();
    const jobId = job["_id"];
    //need to run the file and send the response
    console.log(job, jobId);

    res.status(201).json({ success: true, jobId });
    let output;
    job["startedAt"] = new Date();

    if (language === "Cpp") {
      output = await executeCpp(filePath);
    } else {
      output = await executePy(filePath);
    }
    // res.json({ filePath, output });
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    console.log(job);
    await job.save();
  } catch (e) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(e);
    await job.save();

    console.log(job);
    // res.status(500).json({ e });
  }
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
