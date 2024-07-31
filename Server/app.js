const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

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

app.get("/", (req, res) => {
  return res.json({ hello: "world!" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  console.log(language, code);
  console.log(language, code);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  try {
    //need to generate C++ file with content from the request
    const filePath = await generateFile(language, code);

    const job = await new Job({ language, filePath }).save();
    //need to run the file and send the response
    console.log(job);
    let output;
    if (language === "Cpp") {
      output = await executeCpp(filePath);
    } else {
      output = await executePy(filePath);
    }
    res.json({ filePath, output });
  } catch (e) {
    res.status(500).json({ e });
  }
});

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
