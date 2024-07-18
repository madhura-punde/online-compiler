const express = require("express");
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");

const app = express();

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
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  try {
    //need to generate C++ file with content from the request
    const filePath = await generateFile(language.value, code);
    //need to run the file and send the response

    let output;
    if (language.value === "Cpp") {
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
