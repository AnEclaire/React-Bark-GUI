import React, { useState } from "react";
import './App.css'
import axios from "axios"

const App = () => {
  const [src, setSrc] = useState("");
  const [state, setState] = useState({
    prompt: "",
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      name: state.prompt,
    };
    try {
      const response = await axios.post("http://localhost:5000/api/generateFile", userData);
      console.log(response.status, response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card">
        <h1>Generate Audio</h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <label htmlFor="prompt">
            Prompt Text: 
            <input 
            type="text" 
            name="prompt"
            value={state.prompt}
            onChange={handleChange} 
            />
          </label>
          <button type="submit">Generate</button>
        </form>
        <div>
          <audio id="audio" controls src={src} />
        </div>
      </div>
    </>
  );
};

export default App