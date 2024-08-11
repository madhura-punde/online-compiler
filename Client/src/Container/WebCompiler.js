import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";

const WebCompiler = () => {
  const [code, setCode] = useState("");
  const [languageee, setLanguageee] = useState("");
  const [output, setOutput] = useState();
  const [jobStatus, setJobStatus] = useState();

  const languages = [
    { value: "cpp", label: "C++" },
    { value: "Py", label: "Python" },
  ];

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", languageee.value);
    console.log(`${languageee.value} set as default!`);
  };

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguageee(defaultLang);
  }, []);

  useEffect(() => {
    setCode(stubs[languageee]);
  }, [languageee]);

  const compileCode = async () => {
    setOutput("");

    if (!languageee) {
      alert("Please select language!!");
    } else if (!code) {
      alert("Empty code, add relevant code snippet in editor");
    } else {
      let language = languageee.value;
      console.log(languageee, language);
      const payload = {
        language,
        code,
      };
      try {
        const { data } = await axios.post("http://localhost:8080/run", payload);
        console.log("data", data);
        setOutput(data.jobId);
        setJobStatus(data.success);
        let pollInterval;
        // need to poll here
        // pollInterval = setInterval(async () => {
        //   const { data: dataResults } = await axios.get(
        //     "http://localhost:8080/status",
        //     { params: { id: data.jobId } }
        //   );
        //   // console.log(dataResults);
        //   const { success, job, error } = dataResults;
        //   console.log(dataResults);
        //   if (success) {
        //     const { status: jobStatus, output: jobOutput } = job;
        //     // setStatus(jobStatus);
        //     // setJobDetails(job);
        //     if (jobStatus === "pending") return;
        //     setOutput(jobOutput);
        //     clearInterval(pollInterval);
        //   } else {
        //     console.error(error);
        //     setOutput(error);
        //     // setStatus("Bad request");
        //     clearInterval(pollInterval);
        //   }
        // }, 1000);
      } catch ({ response }) {
        if (response) {
          const errorMsg = response.data.e.stderr;
          setOutput(errorMsg);
        } else {
          setOutput("Error connecting to Server!");
        }
      }
    }
  };

  return (
    <div>
      <h1>Web-based Compiler</h1>
      <div>
        <label>Select Language</label>
        <div style={{ width: "300px", margin: "auto" }}>
          <Select options={languages} onChange={setLanguageee} />
        </div>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <label>Code Editor</label>
      <div>
        <textarea
          rows={20}
          cols={80}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button onClick={compileCode}>Compile</button>
      <div>
        <h2>Output:</h2>
        {output}
        {jobStatus && <p>{jobStatus} completed successfully</p>}
      </div>
    </div>
  );
};

export default WebCompiler;
