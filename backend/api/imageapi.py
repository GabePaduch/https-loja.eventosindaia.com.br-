import os
import json
from flask import Flask, jsonify, request, send_from_directory, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Desativando a política de CORS

project_root = os.path.dirname(os.path.abspath(__file__))
products_path = os.path.join(project_root, '/var/www/areadocliente/my-ecommerce-app/src/pages/products')
images_path = os.path.join(project_root, '/var/www/areadocliente/my-ecommerce-app/src/images')

@app.route('/api/images/<product_name>', methods=['GET'])
def get_images(product_name):
    product_images_path = os.path.join(images_path, product_name)
    if not os.path.exists(product_images_path):
        return jsonify(error='Product not found'), 404

    image_files = [f for f in os.listdir(product_images_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]
    # Criação das URLs das imagens
    image_urls = [url_for('static_files', filename=f'{product_name}/{image}', _external=True) for image in image_files]
    return jsonify(image_urls)

@app.route('/api/products', methods=['GET'])
def get_products():
    with open(os.path.join(products_path, 'products.json')) as f:
        products = json.load(f)
    return jsonify(products)

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    with open(os.path.join(products_path, 'products.json')) as f:
        products = json.load(f)
    product = next((p for p in products if p['id'] == product_id and p.get('active', True)), None)
    if not product:
        return jsonify(error='Product not found'), 404

    product_images_path = os.path.join(images_path, product['name'])
    if os.path.exists(product_images_path):
        image_files = [f for f in os.listdir(product_images_path) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]
        product['images'] = [url_for('static_files', filename=f'{product["name"]}/{image}', _external=True) for image in image_files]
    return jsonify(product)

@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    updated_product = request.json
    with open(os.path.join(products_path, 'products.json')) as f:
        products = json.load(f)

    product_index = next((index for (index, p) in enumerate(products) if p['id'] == product_id), None)
    if product_index is None:
        return jsonify(error='Product not found'), 404

    products[product_index] = updated_product

    with open(os.path.join(products_path, 'products.json'), 'w') as f:
        json.dump(products, f)

    return jsonify(updated_product)

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    with open(os.path.join(products_path, 'products.json')) as f:
        products = json.load(f)

    product_index = next((index for (index, p) in enumerate(products) if p['id'] == product_id), None)
    if product_index is None:
        return jsonify(error='Product not found'), 404

    deleted_product = products.pop(product_index)

    with open(os.path.join(products_path, 'products.json'), 'w') as f:
        json.dump(products, f)

    return jsonify(deleted_product)

@app.route('/static/images/<path:filename>', methods=['GET'])
def static_files(filename):
    return send_from_directory(images_path, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
