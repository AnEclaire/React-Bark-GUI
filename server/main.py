from flask import Flask, jsonify, render_template, send_file, Response, request
from flask_cors import CORS, cross_origin

# For LLM
import sys
import torch
import scipy
from IPython.display import Audio
from transformers import AutoProcessor, BarkModel


app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'Emma',
                'loves',
                'Haru'
            ]
        }
    )

@app.route("/api/generateFile", methods=['POST'])
@cross_origin()
def generateFile():
    data = request.json
    prompt = data.get('name')

    # Set device (CUDA or CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")  # Should print 'cuda'

    # Define precision (use default single-precision floating-point FP32)
    torch_dtype = torch.float32

    # Set Bark pre-trained model
    model_type = "suno/bark"  # Default

    # Use AutoProcessor to instantiate appropriate multi-modal processor for Bark
    processor = AutoProcessor.from_pretrained(model_type, torch_dtype=torch_dtype)

    # Instantiate Bark model
    model = BarkModel.from_pretrained(model_type, torch_dtype=torch_dtype)

    # Move Bark model to CUDA device
    model = model.to(device)

    # Define speaker voice preset
    voice_preset = "v2/en_speaker_1"

    # Define text prompt to generate audio for
    if len(sys.argv) == 2:
        text_prompt = sys.argv[1]
    else:
        text_prompt = prompt
    # Pass voice preset and text prompt into processor
    inputs = processor(text=text_prompt, voice_preset=voice_preset)

    # Generate output audio arrays from input tensors
    audio_arrays = model.generate(**inputs.to(device))

    # Convert into NumPy array in CPU device (with removal of axes of size one from the shape of an array)
    audio_arrays = audio_arrays.cpu().numpy().squeeze()

    # Set sampling rate
    sample_rate = model.generation_config.sample_rate  # Default 24000 Hz

    # Convert audio array into audio sample played in widget
    Audio(audio_arrays, rate=sample_rate)

    # Download audio output as wav file
    scipy.io.wavfile.write("out.wav", 
                        rate=sample_rate, 
                        data=audio_arrays)

    return jsonify('ok'), 200
    

@app.route("/api/getFile", methods=['POST'])
@cross_origin()
def testpost():
    data = request.json
    fileName = data.get('name')
    fileName = fileName.toString()
    return send_file(fileName, mimetype="audio/wav")

if __name__ == "__main__":
    app.run(debug=True, port=5000)