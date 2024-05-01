import React, { useState, useEffect } from "react";
import './App.css'
import axios from "axios"

const App = () => {
  const [src, setSrc] = useState("");
  const [state, setState] = useState({
    prompt: "",
    voice: "v2/en_speaker_9", // Default voice set to "v2/en_speaker_9"
    buttonDisabled: false,
    buttonText: "Submit Prompt", // Default button text
    elapsedTime: 0, // Elapsed time in seconds
  });

  useEffect(() => {
    const fetchAudioFile = async () => {
      try {
        // Make a GET request to fetch the audio file
        const response = await axios.get('https://git.himawari.app/api/getFile?fileName=Hello.wav', {
          responseType: 'blob' // Set responseType to 'blob' to receive binary data
        });

        // Create a URL for the Blob object
        const url = URL.createObjectURL(response.data);

        // Set the URL as the src state
        setSrc(url);
      } catch (error) {
        console.error('Error fetching audio file:', error);
      }
    };

    fetchAudioFile(); // Call the function to fetch the audio file when the component mounts
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  };

  const handleVoiceChange = (event) => {
    const voice = event.target.value;
    setState({
      ...state,
      voice
    });
  };

  const handleDownload = () => {
    // Create an anchor element
    const link = document.createElement('a');
    link.href = src;
    link.download = 'audio.wav'; // Set the default file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ ...state, buttonDisabled: true, buttonText: "Generation in progress..." }); // Disable the button and change text
    
    const userData = {
      name: state.prompt,
      voice: state.voice // Include the selected voice in the data object
    };
    try {
      const response = await axios.post("https://git.himawari.app/api/generateFile", userData);
      console.log(response.status, response.data);
      if (response.status === 200) {
        // Make a GET request to your endpoint to get the .wav file
        const res = await axios.get(`https://git.himawari.app/api/getFile?fileName=${response.data.fileName}`, {
          responseType: 'blob' // Set responseType to 'blob' to receive binary data
        }).then((res) => {
          setSrc(URL.createObjectURL(res.data));
        });
        // Create a Blob from the response data
        const blob = new Blob([res.data], { type: 'audio/wav' });
  
        // Create a URL for the Blob object
        const url = URL.createObjectURL(blob);
  
        // Set the URL as the src state
        setSrc(url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setState({ ...state, buttonDisabled: false, buttonText: "Submit Prompt" }); // Enable the button and change text
    }
  };

  // Update elapsed time every second while generation is in progress
  useEffect(() => {
    let intervalId;
    if (state.buttonText === "Generation in progress...") {
      intervalId = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          elapsedTime: prevState.elapsedTime + 1,
        }));
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [state.buttonText]);

  return (
    <>
      <div className="container">
        <div className="card">
          <h1>Generate Audio</h1>
          <hr />
          {/* Voice Selection Section */}
          <div className="voice-selection">
            <label htmlFor="voice" className="voice-label">
              Voice Selection:
              <select id="voice" name="voice" value={state.voice} onMouseDown="if(this.options.length>8){this.size=8;}" onChange={handleVoiceChange} className="voice-select">
                <option value="v2/en_speaker_0">English Male 0</option>
                <option value="v2/en_speaker_1">English Male 1</option>
                <option value="v2/en_speaker_2">English Male 2</option>
                <option value="v2/en_speaker_3">English Male 3</option>
                <option value="v2/en_speaker_4">English Male 4</option>
                <option value="v2/en_speaker_5">English Male 5 (Grainy)</option>
                <option value="v2/en_speaker_6">English Male 6 (Popular)</option>
                <option value="v2/en_speaker_7">English Male 7</option>
                <option value="v2/en_speaker_8">English Male 8</option>
                <option value="v2/en_speaker_9">English Female 9</option>
                <option value="v2/zh_speaker_0">Chinese Male 0</option>
                <option value="v2/zh_speaker_1">Chinese Male 1</option>
                <option value="v2/zh_speaker_2">Chinese Male 2</option>
                <option value="v2/zh_speaker_3">Chinese Male 3</option>
                <option value="v2/zh_speaker_4">Chinese Female 4</option>
                <option value="v2/zh_speaker_5">Chinese Male 5</option>
                <option value="v2/zh_speaker_6">Chinese Female 6 (Background Noise)</option>
                <option value="v2/zh_speaker_7">Chinese Female 7</option>
                <option value="v2/zh_speaker_8">Chinese Male 8</option>
                <option value="v2/zh_speaker_9">Chinese Female 9</option>
                <option value="v2/fr_speaker_0">French Male 0</option>
                <option value="v2/fr_speaker_1">French Female 1</option>
                <option value="v2/fr_speaker_2">French Female 2</option>
                <option value="v2/fr_speaker_3">French Male 3</option>
                <option value="v2/fr_speaker_4">French Male 4</option>
                <option value="v2/fr_speaker_5">French Female 5</option>
                <option value="v2/fr_speaker_6">French Male 6</option>
                <option value="v2/fr_speaker_7">French Male 7</option>
                <option value="v2/fr_speaker_8">French Male 8</option>
                <option value="v2/fr_speaker_9">French Male 9 (Auditorium)</option>
                <option value="v2/de_speaker_0">German Male 0</option>
                <option value="v2/de_speaker_1">German Male 1</option>
                <option value="v2/de_speaker_2">German Male 2</option>
                <option value="v2/de_speaker_3">German Female 3</option>
                <option value="v2/de_speaker_4">German Male 4</option>
                <option value="v2/de_speaker_5">German Male 5</option>
                <option value="v2/de_speaker_6">German Male 6</option>
                <option value="v2/de_speaker_7">German Male 7</option>
                <option value="v2/de_speaker_8">German Female 8</option>
                <option value="v2/de_speaker_9">German Male 9</option>
                <option value="v2/hi_speaker_0">Hindi Female 0</option>
                <option value="v2/hi_speaker_1">Hindi Female 1 (Background Noise)</option>
                <option value="v2/hi_speaker_2">Hindi Male 2</option>
                <option value="v2/hi_speaker_3">Hindi Female 3</option>
                <option value="v2/hi_speaker_4">Hindi Female 4 (Background Noise)</option>
                <option value="v2/hi_speaker_5">Hindi Male 5</option>
                <option value="v2/hi_speaker_6">Hindi Male 6</option>
                <option value="v2/hi_speaker_7">Hindi Male 7</option>
                <option value="v2/hi_speaker_8">Hindi Male 8</option>
                <option value="v2/hi_speaker_9">Hindi Female 9</option>
                <option value="v2/it_speaker_0">Italian Male 0</option>
                <option value="v2/it_speaker_1">Italian Male 1</option>
                <option value="v2/it_speaker_2">Italian Female 2</option>
                <option value="v2/it_speaker_3">Italian Male 3</option>
                <option value="v2/it_speaker_4">Italian Male 4 (Popular)</option>
                <option value="v2/it_speaker_5">Italian Male 5</option>
                <option value="v2/it_speaker_6">Italian Male 6</option>
                <option value="v2/it_speaker_7">Italian Female 7</option>
                <option value="v2/it_speaker_8">Italian Male 8</option>
                <option value="v2/it_speaker_9">Italian Male 9</option>
                <option value="v2/ja_speaker_0">Japanese Female 0</option>
                <option value="v2/ja_speaker_1">Japanese Female 1 (Background Noise)</option>
                <option value="v2/ja_speaker_2">Japanese Male 2</option>
                <option value="v2/ja_speaker_3">Japanese Female 3</option>
                <option value="v2/ja_speaker_4">Japanese Female 4</option>
                <option value="v2/ja_speaker_5">Japanese Female 5</option>
                <option value="v2/ja_speaker_6">Japanese Male 6 </option>
                <option value="v2/ja_speaker_7">Japanese Female 7</option>
                <option value="v2/ja_speaker_8">Japanese Female 8</option>
                <option value="v2/ja_speaker_9">Japanese Female 9</option>
                <option value="v2/ko_speaker_0">Korean Female 0</option>
                <option value="v2/ko_speaker_1">Korean Male 1</option>
                <option value="v2/ko_speaker_2">Korean Male 2</option>
                <option value="v2/ko_speaker_3">Korean Male 3</option>
                <option value="v2/ko_speaker_4">Korean Male 4</option>
                <option value="v2/ko_speaker_5">Korean Male 5</option>
                <option value="v2/ko_speaker_6">Korean Male 6</option>
                <option value="v2/ko_speaker_7">Korean Male 7</option>
                <option value="v2/ko_speaker_8">Korean Male 8</option>
                <option value="v2/ko_speaker_9">Korean Male 9</option>
                <option value="v2/pl_speaker_0">Polish Male 0</option>
                <option value="v2/pl_speaker_1">Polish Male 1</option>
                <option value="v2/pl_speaker_2">Polish Male 2</option>
                <option value="v2/pl_speaker_3">Polish Male 3</option>
                <option value="v2/pl_speaker_4">Polish Female 4</option>
                <option value="v2/pl_speaker_5">Polish Male 5</option>
                <option value="v2/pl_speaker_6">Polish Female 6</option>
                <option value="v2/pl_speaker_7">Polish Male 7</option>
                <option value="v2/pl_speaker_8">Polish Male 8</option>
                <option value="v2/pl_speaker_9">Polish Female 9</option>
                <option value="v2/pt_speaker_0">Portuguese Male 0</option>
                <option value="v2/pt_speaker_1">Portuguese Male 1</option>
                <option value="v2/pt_speaker_2">Portuguese Male 2</option>
                <option value="v2/pt_speaker_3">Portuguese Male 3</option>
                <option value="v2/pt_speaker_4">Portuguese Male 4</option>
                <option value="v2/pt_speaker_5">Portuguese Male 5</option>
                <option value="v2/pt_speaker_6">Portuguese Male 6 (Background Noise)</option>
                <option value="v2/pt_speaker_7">Portuguese Male 7</option>
                <option value="v2/pt_speaker_8">Portuguese Male 8</option>
                <option value="v2/pt_speaker_9">Portuguese Male 9</option>
                <option value="v2/ru_speaker_0">Russian Male 0</option>
                <option value="v2/ru_speaker_1">Russian Male 1 (Echos)</option>
                <option value="v2/ru_speaker_2">Russian Male 2 (Echos)</option>
                <option value="v2/ru_speaker_3">Russian Male 3</option>
                <option value="v2/ru_speaker_4">Russian Male 4</option>
                <option value="v2/ru_speaker_5">Russian Female 5</option>
                <option value="v2/ru_speaker_6">Russian Female 6 (Grainy)</option>
                <option value="v2/ru_speaker_7">Russian Male 7</option>
                <option value="v2/ru_speaker_8">Russian Male 8 (Grainy)</option>
                <option value="v2/ru_speaker_9">Russian Female 9 (Grainy)</option>
                <option value="v2/es_speaker_0">Spanish Male 0</option>
                <option value="v2/es_speaker_1">Spanish Male 1</option>
                <option value="v2/es_speaker_2">Spanish Male 2 (Background Noise)</option>
                <option value="v2/es_speaker_3">Spanish Male 3 (Background Noise)</option>
                <option value="v2/es_speaker_4">Spanish Male 4</option>
                <option value="v2/es_speaker_5">Spanish Male 5 (Background Noise)</option>
                <option value="v2/es_speaker_6">Spanish Male 6</option>
                <option value="v2/es_speaker_7">Spanish Male 7</option>
                <option value="v2/es_speaker_8">Spanish Female 8</option>
                <option value="v2/es_speaker_9">Spanish Female 9</option>
                <option value="v2/tr_speaker_0">Turkish Male 0</option>
                <option value="v2/tr_speaker_1">Turkish Male 1</option>
                <option value="v2/tr_speaker_2">Turkish Male 2</option>
                <option value="v2/tr_speaker_3">Turkish Male 3</option>
                <option value="v2/tr_speaker_4">Turkish Female 4</option>
                <option value="v2/tr_speaker_5">Turkish Female 5</option>
                <option value="v2/tr_speaker_6">Turkish Male 6</option>
                <option value="v2/tr_speaker_7">Turkish Male 7 (Grainy)</option>
                <option value="v2/tr_speaker_8">Turkish Male 8</option>
                <option value="v2/tr_speaker_9">Turkish Male 9</option>
              </select>
            </label>
          </div>
          <hr />
          {/* End Voice Selection Section */}
          <form onSubmit={handleSubmit} className="form-container">
            <label htmlFor="prompt" className="input-label">
              <textarea 
                cols="41"
                rows="5"
                type="text" 
                name="prompt"
                placeholder="Hello! I am powered by Bark and this is deployed on an RTX 4080 Super!"
                value={state.prompt}
                onChange={handleChange} 
                className="text-input"
              />
              <button type="submit" className="generate-button" disabled={state.buttonDisabled}>
              {state.buttonText}
              {state.buttonText === "Generation in progress..." && ` (${state.elapsedTime}s)`}
              </button>
            </label>
          </form>
          <hr />
          <div className="audio-container">
            <audio id="audio" controls src={src} />
            {src && (
              <button onClick={handleDownload} className="download-button">
                Download
              </button>
            )} 
          </div>
          <div>
            <hr />
            <p>
              About: Generates a voice clip using generative AI. Maximum length is 13 seconds. Powered by Bark.
            </p>
          </div>
        </div>
        <div className="card2">
          <h1>Instructions</h1>
          <hr />
          <div>
            <p>
              You can pass modifiers that the model will use to augment the voice file.
            </p>
            <div className="instruction-grid">
              <div>[laughter]</div>
              <div>[laughs]</div>
              <div>[sighs]</div>
              <div>[music]</div>
              <div>[gasps]</div>
              <div>[clears throat]</div>
              <div>— or ... for hesitation</div>
              <div>♪ for song lyrics</div>
              <div>CAPITALIZATION for emphasis</div>
              <div>[MAN] or [WOMAN] to direct who generated clip is spoken to.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
