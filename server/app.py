from flask import Flask, render_template, request, redirect, url_for, send_from_directory, Response, jsonify
import os
import cv2 as cv
import time
import geocoder
import shutil
from flask_cors import CORS
import numpy as np




app = Flask(__name__)
cors = CORS(app, origins='*')


g = geocoder.ip('me')
result_path = "pothole_coordinates"
Conf_threshold = 0.5
NMS_threshold = 0.4

# @app.route('/hasPotholes', methods=['GET'])
# def upload_image():
#     print("inside the hasPotholes")
#     if 'file' not in request.files:
#         return redirect(request.url)

#     file = request.files['file']
#     if file.filename == '':
#         return redirect(request.url)

#     if file:
#         if file.filename.endswith(('.jpg', '.jpeg', '.png')):
#             image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#             print(image_path)
           
#             file.save(image_path)

#             # Call your image processing script here
#             img = cv.imread(image_path)
#             with open(os.path.join(r"C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\\",'obj.names'), 'r') as f:
#                 classes = f.read().splitlines()
#             net = cv.dnn.readNet(r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.weights', r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.cfg')
#             model = cv.dnn_DetectionModel(net)
#             model.setInputParams(scale=1 / 255, size=(640, 480), swapRB=True)
#             classIds, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)
#             print("classIds:", classIds)
#             print("scores:", scores)
#             print("boxes:", boxes)

#             if(len(classIds)>0):
#                 return True
#     return False


@app.route('/hasPotholes', methods=['POST'])
def upload_image():
    print("inside the hasPotholes")
    print(request.files)
    if 'file' not in request.files:
        print("file not in requests")
        return "False"  # No image file found in the request
    

    file = request.files['file']
    if file.filename == '':
        print("empty file")
        return "False"  # Empty filename
    

    # Read the image from memory
    nparr = np.frombuffer(file.read(), np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)

    # Perform operations on the image
    with open(os.path.join(r"C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\\",'obj.names'), 'r') as f:
        classes = f.read().splitlines()
    net = cv.dnn.readNet(r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.weights', r'C:\Users\mohd noor ahmed\OneDrive\Desktop\faiz pothole project\server\project_files\yolov4_tiny.cfg')
    model = cv.dnn_DetectionModel(net)
    model.setInputParams(scale=1 / 255, size=(640, 480), swapRB=True)
    classIds, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)
    print("classIds:", classIds)
    print("scores:", scores)
    print("boxes:", boxes)

    # Check if there are any potholes detected
    if len(classIds) > 0:
        return "True"  # Indicate that potholes were detected
    else:
        return "False"  # Indicate that no potholes were detected

if __name__ == "__main__":
    app.run(debug=True)

   


