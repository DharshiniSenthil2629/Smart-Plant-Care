from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Backend is working ✅'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data.get('image')

    if image_data:
        try:
            # Split the base64 string
            header, encoded = image_data.split(',', 1)
            image_bytes = base64.b64decode(encoded)
            image = Image.open(BytesIO(image_bytes))

            # Dummy logic — replace with actual prediction logic
            predicted_disease = "Leaf Spot"

            return jsonify({'disease': predicted_disease})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'No image provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
