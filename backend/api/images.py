from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import ssl

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite CORS de qualquer origem

UPLOAD_FOLDER = r'/var/www/areadocliente/my-ecommerce-app/src/images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-folder', methods=['POST'])
def upload_folder():
    if 'files' not in request.files or 'folder' not in request.form:
        return jsonify({"error": "No files or folder part"}), 400

    folder_name = request.form['folder']  # Use o nome da pasta diretamente
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    os.makedirs(folder_path, exist_ok=True)

    files = request.files.getlist('files')

    if not files:
        return jsonify({"error": "No selected files"}), 400

    for file in files:
        if not allowed_file(file.filename):
            return jsonify({"error": f"File type not allowed: {file.filename}"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)

    return jsonify({"message": "Files uploaded"}), 200

if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    context.load_cert_chain(certfile='/etc/ssl/loja.eventosindaia.com.br/fullchain.pem', keyfile='/etc/ssl/loja.eventosindaia.com.br/privkey.pem')
    app.run(host='0.0.0.0', port=5001, ssl_context=context, debug=True)  # Escuta em todas as interfaces de rede

