from flask import Flask, render_template, request, jsonify
from transformers import BlenderbotForConditionalGeneration, BlenderbotTokenizer
import torch  # Import torch module
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the pre-trained BlenderBot model and tokenizer
model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

@app.route('/')
def home():
    return render_template('chatbot.html')

@app.route('/login')
def fun():
    return render_template('home.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json['user_input']
    
    # Tokenize user input
    inputs = tokenizer([user_input], return_tensors="pt", max_length=512, truncation=True)

    # Generate response
    with torch.no_grad():
        chat_response = model.generate(**inputs)

    # Decode the response tokens and return the text
    response_text = tokenizer.batch_decode(chat_response, skip_special_tokens=True)[0]

    return jsonify({'bot_response': response_text})

if __name__ == '__main__':
    app.run(port=5500,debug=True)
