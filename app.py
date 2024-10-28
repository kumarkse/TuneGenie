from flask import Flask, render_template , send_from_directory 
from flask import Flask, request, jsonify
import os

from testing import retmelody

app = Flask(__name__)

FILE_DIRECTORY = os.path.join(app.root_path,'static','audio')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(FILE_DIRECTORY, filename, as_attachment=True)

@app.route('/hi')
def disp():
    return render_template('tester.html')

@app.route('/create-song', methods=['POST'])
def create_song():
    data = request.get_json()
    seed = data.get('seed')
    retmelody(seed)

    # You can process the seed here (e.g., generate a melody, save to a database, etc.)
    print(f'Received seed: {seed}')
    print(type(seed))
    print("hjhj")

    # Respond back to the frontend
    return jsonify({'message': 'Song creation in progress', 'seed': seed})

#commenting it for vercel
if __name__ == '__main__':
    app.run()