from flask import Flask, render_template , send_from_directory 
import os

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

if __name__ == '__main__':
    app.run(debug=True)