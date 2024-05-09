from flask import Flask, request, jsonify
import os
import cv2 as cv
import geocoder
from flask_cors import CORS
import numpy as np
import base64 

app = Flask(__name__)
cors = CORS(app, origins='*')
g = geocoder.ip('me')
result_path = "pothole_coordinates"
Conf_threshold = 0.5
NMS_threshold = 0.4

@app.route('/hasPotholes', methods=['POST'])
def upload_image():
    print("inside api")
    if 'file' not in request.files:
        print("File not in request")
        return jsonify({'message': 'No image file found'}), 400  # Bad request

    file = request.files['file']
    if file.filename == '':
        print("Empty file")
        return jsonify({'message': 'Empty filename'}), 400  # Bad request

    try:
        # Read the image from memory
        nparr = np.frombuffer(file.read(), np.uint8)
        img = cv.imdecode(nparr, cv.IMREAD_COLOR)

        # Perform object detection
        with open(os.path.join(r"C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\\",'obj.names'), 'r') as f:
            classes = f.read().splitlines()
        net = cv.dnn.readNet(r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.weights', r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.cfg')
        model = cv.dnn_DetectionModel(net)
        model.setInputParams(scale=1 / 255, size=(640, 480), swapRB=True)
        classIds, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)
        

        # Handle detections (optional: highlight potholes on the image)
        print(classIds)
        
        has_potholes = len(classIds) > 0
        if has_potholes:
            for (classId, score, box) in zip(classIds, scores, boxes):
                cv.rectangle(img, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]),
                              color=(0, 0, 255), thickness=2)

        # Prepare response
        response = {
            'has_potholes': has_potholes,
            'message': 'Potholes detected' if has_potholes else 'No potholes detected'
        }

        # Option 1: Return JSON with "True/False" and base64 encoded image (if applicable)
        if has_potholes:
            retval, buffer = cv.imencode('.jpg', img)  # Encode image as JPEG
            response['image_base64'] = base64.b64encode(buffer).decode('utf-8')

        return jsonify(response)

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'message': 'Internal server error'}), 500  # Internal server error

if __name__ == '__main__':
    app.run(debug=True)

