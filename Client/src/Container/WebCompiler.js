import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";

const WebCompiler = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState();

  const languages = [
    { value: "Cpp", label: "C++" },
    { value: "Py", label: "Python" },
  ];

  const compileCode = async () => {
    if (!language) {
      alert("Please select language!!");
    } else if (!code) {
      alert("Empty code, add relevant code snippet in editor");
    } else {
      const payload = {
        language,
        code,
      };
      try {
        const { data } = await axios.post("http://localhost:8080/run", payload);
        setOutput(data.output);
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
          <Select options={languages} onChange={setLanguage} />
        </div>
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
      </div>
    </div>
  );
};

export default WebCompiler;
