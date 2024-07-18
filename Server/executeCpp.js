const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  ///Users/madhurapunde/Desktop/My Folder/Web Development/web-based-compiler/Server/codes/933bc879-c270-4e13-93ef-136f13a4baf7.cpp
  //933bc879-c270-4e13-93ef-136f13a4baf7.cpp
  //[933bc879-c270-4e13-93ef-136f13a4baf7,cpp]
  const jobId = path.basename(filepath).split(".")[0];
  const outpath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outpath} && cd ${outputPath} && ./${jobId}.out`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
          return;
        }
        if (stderr) {
          reject({ stderr });
          return;
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
