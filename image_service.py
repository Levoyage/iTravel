import os
from bing_image_downloader import downloader
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 下载图片并返回图片URL
def fetch_image_urls(query, limit=1, output_dir='dataset'):
    output_dir = os.path.join(os.getcwd(), output_dir, query.replace(" ", "_"))

    # 打印下载目录用于调试
    print(f"Download directory: {output_dir}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    downloader.download(query, limit=limit, output_dir=output_dir, adult_filter_off=True, force_replace=False, timeout=60, verbose=True)
    image_urls = []
    for root, dirs, files in os.walk(output_dir):
        for file in files:
            if file.endswith(".jpg") or file.endswith(".png"):
                image_path = os.path.join(root, file)
                image_urls.append(image_path)
                # 打印找到的图片路径用于调试
                print(f"Found image: {image_path}")
    return image_urls

@app.route('/get_image', methods=['POST'])
def get_image():
    try:
        query = request.json['query']
        image_urls = fetch_image_urls(query, limit=1)
        if image_urls:
            # 提供相对路径
            relative_path = os.path.relpath(image_urls[0], os.path.join(os.getcwd(), 'dataset'))
            image_url = f"http://100.27.226.64:5000/dataset/{relative_path.replace(os.sep, '/')}"
            # 打印生成的 image_url 用于调试
            print(f"Generated image URL: {image_url}")
            return jsonify({"image_url": image_url})
        else:
            print("No images found")
            return jsonify({"error": "No images found"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# 新的路由来提供图片
@app.route('/dataset/<path:filename>')
def serve_image(filename):
    # 打印提供图片的路径用于调试
    full_path = os.path.join(os.getcwd(), 'dataset', filename)
    print(f"Serving image from: {full_path}")
    return send_from_directory(os.path.join(os.getcwd(), 'dataset'), filename)

if __name__ == '__main__':
    # 打印当前工作目录
    print(f"Starting Flask app in directory: {os.getcwd()}")
    app.run(host='0.0.0.0', port=5000)
